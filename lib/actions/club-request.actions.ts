'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { clubEventRequestSchema } from '../validators';
import { z } from 'zod';
import { auth } from '@/auth';
import { Prisma } from '@/src/generated/prisma';

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

// Get all approved reading clubs with filtering and pagination
export async function getReadingClubs({
  page = 1,
  limit = 10,
  format,
  search,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  format?: 'online' | 'offline';
  search?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ReadingClubWhereInput = {
      isActive: true,
    };

    if (format) {
      where.format = format;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { purpose: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) {
        where.startDate.gte = startDate;
      }
      if (endDate) {
        where.startDate.lte = endDate;
      }
    }

    const [clubs, totalCount] = await Promise.all([
      prisma.readingClub.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startDate: 'asc',
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.readingClub.count({ where }),
    ]);

    return {
      success: true,
      data: convertToPlainObj(clubs),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all approved events with filtering and pagination
export async function getEvents({
  page = 1,
  limit = 10,
  format,
  search,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  format?: 'online' | 'offline';
  search?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.EventWhereInput = {
      isActive: true,
    };

    if (format) {
      where.format = format;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { purpose: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.eventDate = {};
      if (startDate) {
        where.eventDate.gte = startDate;
      }
      if (endDate) {
        where.eventDate.lte = endDate;
      }
    }

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          eventDate: 'asc',
        },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      success: true,
      data: convertToPlainObj(events),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get a single reading club by ID
export async function getReadingClubById(id: string) {
  try {
    const club = await prisma.readingClub.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!club) {
      return {
        success: false,
        message: 'Reading club not found',
      };
    }

    return {
      success: true,
      data: convertToPlainObj(club),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get a single event by ID
export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!event) {
      return {
        success: false,
        message: 'Event not found',
      };
    }

    return {
      success: true,
      data: convertToPlainObj(event),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
