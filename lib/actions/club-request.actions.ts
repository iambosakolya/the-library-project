'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { clubEventRequestSchema } from '../validators';
import { z } from 'zod';
import { auth } from '@/auth';

// Create a new club or event request
export async function createClubRequest(
  data: z.infer<typeof clubEventRequestSchema>,
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to create a club or event',
      };
    }

    // Validate the input data
    const validatedData = clubEventRequestSchema.parse(data);

    // Check if a request with the same title already exists for this user
    const existingRequest = await prisma.clubRequest.findFirst({
      where: {
        userId: session.user.id,
        title: validatedData.title,
        status: {
          in: ['pending', 'approved'],
        },
      },
    });

    if (existingRequest) {
      return {
        success: false,
        message:
          'You already have a pending or approved request with this title',
      };
    }

    // Verify that all books exist
    const books = await prisma.product.findMany({
      where: {
        id: {
          in: validatedData.bookIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (books.length !== validatedData.bookIds.length) {
      return {
        success: false,
        message: 'One or more selected books do not exist',
      };
    }

    // Create the club request
    const clubRequest = await prisma.clubRequest.create({
      data: {
        userId: session.user.id,
        type: validatedData.type,
        title: validatedData.title,
        purpose: validatedData.purpose,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate || null,
        capacity: validatedData.capacity,
        format: validatedData.format,
        address: validatedData.address || null,
        onlineLink: validatedData.onlineLink || null,
        sessionCount: validatedData.sessionCount,
        bookIds: validatedData.bookIds,
        status: 'pending',
      },
    });

    revalidatePath('/user/club-requests');

    return {
      success: true,
      message: `${validatedData.type === 'club' ? 'Reading club' : 'Event'} request submitted successfully. You will be notified once it's reviewed.`,
      data: convertToPlainObj(clubRequest),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all club requests for the current user
export async function getUserClubRequests() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error('You must be signed in to view your requests');
    }

    const requests = await prisma.clubRequest.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convertToPlainObj(requests);
  } catch (error) {
    throw new Error(formatError(error));
  }
}

// Get a single club request by ID
export async function getClubRequestById(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error('You must be signed in to view this request');
    }

    const request = await prisma.clubRequest.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    return convertToPlainObj(request);
  } catch (error) {
    throw new Error(formatError(error));
  }
}

// Get all pending club requests (admin only)
export async function getPendingClubRequests() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const requests = await prisma.clubRequest.findMany({
      where: {
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convertToPlainObj(requests);
  } catch (error) {
    throw new Error(formatError(error));
  }
}

// Approve a club request (admin only)
export async function approveClubRequest(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    const request = await prisma.clubRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return {
        success: false,
        message: 'Request not found',
      };
    }

    if (request.status !== 'pending') {
      return {
        success: false,
        message: 'This request has already been processed',
      };
    }

    // Update request status
    await prisma.clubRequest.update({
      where: { id },
      data: {
        status: 'approved',
      },
    });

    // Create ReadingClub or Event based on type
    if (request.type === 'club') {
      await prisma.readingClub.create({
        data: {
          clubRequestId: request.id,
          title: request.title,
          purpose: request.purpose,
          description: request.description,
          startDate: request.startDate,
          endDate: request.endDate,
          capacity: request.capacity,
          format: request.format,
          address: request.address,
          onlineLink: request.onlineLink,
          sessionCount: request.sessionCount,
          bookIds: request.bookIds,
          creatorId: request.userId,
          memberIds: [request.userId], // Creator is automatically a member
        },
      });
    } else {
      await prisma.event.create({
        data: {
          eventRequestId: request.id,
          title: request.title,
          purpose: request.purpose,
          description: request.description,
          eventDate: request.startDate,
          capacity: request.capacity,
          format: request.format,
          address: request.address,
          onlineLink: request.onlineLink,
          bookIds: request.bookIds,
          organizerId: request.userId,
          attendeeIds: [request.userId], // Organizer is automatically an attendee
        },
      });
    }

    revalidatePath('/admin/club-requests');
    revalidatePath('/user/club-requests');

    return {
      success: true,
      message: `${request.type === 'club' ? 'Reading club' : 'Event'} approved successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Reject a club request (admin only)
export async function rejectClubRequest(id: string, reason: string) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    const request = await prisma.clubRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return {
        success: false,
        message: 'Request not found',
      };
    }

    if (request.status !== 'pending') {
      return {
        success: false,
        message: 'This request has already been processed',
      };
    }

    await prisma.clubRequest.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
    });

    revalidatePath('/admin/club-requests');
    revalidatePath('/user/club-requests');

    return {
      success: true,
      message: 'Request rejected successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
