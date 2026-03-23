'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { auth, signIn, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';
import {
  signInInsertSchema,
  registerInsertSchema,
  shippingSchema,
  paymentMethodSchema,
  updateProfileSchema,
} from '../validators';
import { hashSync } from 'bcrypt-ts-edge';
import { z } from 'zod';

// ─── Auth ──────────────────────────────────────────────────────────

export async function signInEmailPass(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInInsertSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if ((error as { type?: string }).type === 'CredentialsSignin') {
      return { success: false, message: 'Invalid email or password' };
    }
    throw error;
  }
}

export async function signUpUser(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = registerInsertSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    if ((error as { type?: string }).type === 'CredentialsSignin') {
      return { success: false, message: 'Invalid email or password' };
    }
    throw error;
  }
}

export async function signingOut() {
  await signOut();
}

// ─── User CRUD ─────────────────────────────────────────────────────

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return convertToPlainObj(user);
}

export async function updateUserAddress(
  data: z.infer<typeof shippingSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User is not authenticated');
    }

    const address = shippingSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { address },
    });

    revalidatePath('/shipping');

    return { success: true, message: 'Address updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updatePaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User is not authenticated');
    }

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { paymentMethod: paymentMethod.type },
    });

    revalidatePath('/payment-method');

    return { success: true, message: 'Payment method updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProfile(
  data: z.infer<typeof updateProfileSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User is not authenticated');
    }

    const user = updateProfileSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: user.name },
    });

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// ─── Public Profile ────────────────────────────────────────────────

export async function getUserPublicProfile(userId: string) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        registrations: {
          where: { status: 'active' },
          select: {
            club: {
              select: { id: true, title: true, isActive: true },
            },
            event: {
              select: { id: true, title: true, isActive: true, eventDate: true },
            },
          },
        },
        organizedEvents: {
          select: { id: true, title: true, isActive: true },
        },
        createdClubs: {
          select: { id: true, title: true, isActive: true },
        },
        _count: {
          select: {
            reviews: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const recentReviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        product: { select: { slug: true, name: true } },
      },
    });

    const clubs: { id: string; title: string; isActive: boolean }[] = [];
    const registeredEvents: { id: string; title: string; eventDate: Date }[] = [];
    const seenClubIds = new Set<string>();
    const seenEventIds = new Set<string>();

    for (const club of user.createdClubs) {
      if (!seenClubIds.has(club.id)) {
        seenClubIds.add(club.id);
        clubs.push(club);
      }
    }

    for (const reg of user.registrations) {
      if (reg.club && !seenClubIds.has(reg.club.id)) {
        seenClubIds.add(reg.club.id);
        clubs.push(reg.club);
      }
      if (reg.event && !seenEventIds.has(reg.event.id)) {
        seenEventIds.add(reg.event.id);
        registeredEvents.push({
          id: reg.event.id,
          title: reg.event.title,
          eventDate: reg.event.eventDate,
        });
      }
    }

    let isFollowedByCurrentUser = false;
    if (currentUserId && currentUserId !== userId) {
      const follow = await prisma.userFollow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });
      isFollowedByCurrentUser = !!follow;
    }

    const profile = {
      id: user.id,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      clubs,
      organizedEvents: user.organizedEvents,
      registeredEvents,
      totalReviews: user._count.reviews,
      recentReviews,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      isFollowedByCurrentUser,
    };

    return { success: true, data: convertToPlainObj(profile) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getUserReviews(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  try {
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          product: { select: { slug: true, name: true } },
        },
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    return {
      success: true,
      data: convertToPlainObj(reviews),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function followUser(targetUserId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in to follow users' };
    }

    if (session.user.id === targetUserId) {
      return { success: false, message: 'You cannot follow yourself' };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser) {
      return { success: false, message: 'User not found' };
    }

    const existing = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      return { success: false, message: 'Already following this user' };
    }

    await prisma.userFollow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });

    revalidatePath(`/profile/${targetUserId}`);

    return { success: true, message: 'Successfully followed user' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function unfollowUser(targetUserId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in to unfollow users' };
    }

    const existing = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (!existing) {
      return { success: false, message: 'Not following this user' };
    }

    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    revalidatePath(`/profile/${targetUserId}`);

    return { success: true, message: 'Successfully unfollowed user' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
