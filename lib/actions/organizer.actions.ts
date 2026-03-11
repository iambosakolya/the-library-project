'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import {
  editClubEventSchema,
  attendanceSchema,
  participantMessageSchema,
} from '../validators';
import { z } from 'zod';
import { auth } from '@/auth';
import {
  sendParticipantNotification,
  sendOrganizerMessage,
} from '../email';
import type { ChangeHistoryEntry } from '@/types';

function parseChangeHistory(raw: unknown): ChangeHistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is ChangeHistoryEntry =>
      typeof entry === 'object' &&
      entry !== null &&
      'field' in entry &&
      'changedAt' in entry,
  );
}

// Get all clubs and events created/organized by the current user
export async function getMyClubsAndEvents() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    const userId = session.user.id;

    // Get all ClubRequests for this user (single source of truth)
    const allRequests = await prisma.clubRequest.findMany({
      where: { userId },
      include: {
        readingClub: {
          select: {
            id: true,
            title: true,
            isActive: true,
            format: true,
            startDate: true,
            endDate: true,
            capacity: true,
            memberIds: true,
            createdAt: true,
            registrations: {
              where: { status: 'active' },
              select: { id: true },
            },
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            isActive: true,
            format: true,
            eventDate: true,
            capacity: true,
            attendeeIds: true,
            createdAt: true,
            registrations: {
              where: { status: 'active' },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const items = allRequests.map((req) => {
      const isClubType = req.type === 'club';
      const club = req.readingClub;
      const event = req.event;
      const isApproved = req.status === 'approved';

      if (isApproved && isClubType && club) {
        return {
          id: club.id,
          title: club.title,
          type: 'club' as const,
          isActive: club.isActive,
          format: club.format,
          startDate: club.startDate,
          endDate: club.endDate,
          capacity: club.capacity,
          participantCount: club.memberIds.length,
          registrationCount: club.registrations.length,
          requestStatus: req.status as 'pending' | 'approved' | 'rejected',
          createdAt: club.createdAt,
        };
      }

      if (isApproved && !isClubType && event) {
        return {
          id: event.id,
          title: event.title,
          type: 'event' as const,
          isActive: event.isActive,
          format: event.format,
          startDate: event.eventDate,
          endDate: null,
          capacity: event.capacity,
          participantCount: event.attendeeIds.length,
          registrationCount: event.registrations.length,
          requestStatus: req.status as 'pending' | 'approved' | 'rejected',
          createdAt: event.createdAt,
        };
      }

      // Pending or rejected requests (no club/event entity yet)
      return {
        id: req.id,
        title: req.title,
        type: req.type as 'club' | 'event',
        isActive: false,
        format: req.format,
        startDate: req.startDate,
        endDate: req.endDate,
        capacity: req.capacity,
        participantCount: 0,
        registrationCount: 0,
        requestStatus: req.status as 'pending' | 'approved' | 'rejected',
        createdAt: req.createdAt,
      };
    });

    return {
      success: true,
      data: convertToPlainObj(items),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get engagement metrics for a club or event
export async function getEngagementMetrics(
  id: string,
  type: 'club' | 'event',
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({
        where: { id },
        include: {
          registrations: true,
          attendances: true,
        },
      });

      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const activeRegs = club.registrations.filter(
        (r) => r.status === 'active',
      );
      const cancelledRegs = club.registrations.filter(
        (r) => r.status === 'cancelled',
      );

      const totalAttendanceRecords = club.attendances.length;
      const presentRecords = club.attendances.filter(
        (a) => a.status === 'present',
      ).length;
      const attendanceRate =
        totalAttendanceRecords > 0
          ? Math.round((presentRecords / totalAttendanceRecords) * 100)
          : 0;

      const sessionsCompleted = club.attendances.length > 0
        ? Math.max(...club.attendances.map((a) => a.sessionNumber))
        : 0;

      return {
        success: true,
        data: {
          totalRegistrations: club.registrations.length,
          activeRegistrations: activeRegs.length,
          cancelledRegistrations: cancelledRegs.length,
          capacityUtilization: Math.round(
            (club.memberIds.length / club.capacity) * 100,
          ),
          attendanceRate,
          totalSessions: club.sessionCount,
          sessionsCompleted,
        },
      };
    } else {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          registrations: true,
          attendances: true,
        },
      });

      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const activeRegs = event.registrations.filter(
        (r) => r.status === 'active',
      );
      const cancelledRegs = event.registrations.filter(
        (r) => r.status === 'cancelled',
      );

      const totalAttendanceRecords = event.attendances.length;
      const presentRecords = event.attendances.filter(
        (a) => a.status === 'present',
      ).length;
      const attendanceRate =
        totalAttendanceRecords > 0
          ? Math.round((presentRecords / totalAttendanceRecords) * 100)
          : 0;

      return {
        success: true,
        data: {
          totalRegistrations: event.registrations.length,
          activeRegistrations: activeRegs.length,
          cancelledRegistrations: cancelledRegs.length,
          capacityUtilization: Math.round(
            (event.attendeeIds.length / event.capacity) * 100,
          ),
          attendanceRate,
          totalSessions: 1,
          sessionsCompleted: event.attendances.length > 0 ? 1 : 0,
        },
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get participants for a club or event
export async function getParticipants(id: string, type: 'club' | 'event') {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({
        where: { id },
        select: { creatorId: true },
      });
      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
    } else {
      const event = await prisma.event.findUnique({
        where: { id },
        select: { organizerId: true },
      });
      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
    }

    const registrations = await prisma.registration.findMany({
      where: {
        ...(type === 'club' ? { clubId: id } : { eventId: id }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { registeredAt: 'asc' },
    });

    return {
      success: true,
      data: convertToPlainObj(registrations),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get attendance records for a club or event
export async function getAttendanceRecords(
  id: string,
  type: 'club' | 'event',
  sessionNumber?: number,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    // Verify ownership
    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({
        where: { id },
        select: { creatorId: true },
      });
      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
    } else {
      const event = await prisma.event.findUnique({
        where: { id },
        select: { organizerId: true },
      });
      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
    }

    const records = await prisma.attendance.findMany({
      where: {
        ...(type === 'club' ? { clubId: id } : { eventId: id }),
        ...(sessionNumber ? { sessionNumber } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [{ sessionNumber: 'asc' }, { markedAt: 'asc' }],
    });

    return {
      success: true,
      data: convertToPlainObj(records),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Mark attendance for a participant
export async function markAttendance(
  data: z.infer<typeof attendanceSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    const validatedData = attendanceSchema.parse(data);
    const { clubId, eventId } = validatedData;

    if (!clubId && !eventId) {
      return {
        success: false,
        message: 'Either clubId or eventId must be provided',
      };
    }

    // Verify organizer ownership
    if (clubId) {
      const club = await prisma.readingClub.findUnique({
        where: { id: clubId },
        select: { creatorId: true },
      });
      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const attendance = await prisma.attendance.upsert({
        where: {
          userId_clubId_sessionNumber: {
            userId: validatedData.userId,
            clubId,
            sessionNumber: validatedData.sessionNumber,
          },
        },
        update: {
          status: validatedData.status,
          notes: validatedData.notes || null,
          markedAt: new Date(),
        },
        create: {
          userId: validatedData.userId,
          clubId,
          sessionNumber: validatedData.sessionNumber,
          status: validatedData.status,
          notes: validatedData.notes || null,
        },
      });

      revalidatePath('/user/my-clubs');

      return {
        success: true,
        message: 'Attendance marked successfully',
        data: convertToPlainObj(attendance),
      };
    } else {
      const event = await prisma.event.findUnique({
        where: { id: eventId! },
        select: { organizerId: true },
      });
      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const attendance = await prisma.attendance.upsert({
        where: {
          userId_eventId_sessionNumber: {
            userId: validatedData.userId,
            eventId: eventId!,
            sessionNumber: validatedData.sessionNumber,
          },
        },
        update: {
          status: validatedData.status,
          notes: validatedData.notes || null,
          markedAt: new Date(),
        },
        create: {
          userId: validatedData.userId,
          eventId: eventId!,
          sessionNumber: validatedData.sessionNumber,
          status: validatedData.status,
          notes: validatedData.notes || null,
        },
      });

      revalidatePath('/user/my-clubs');

      return {
        success: true,
        message: 'Attendance marked successfully',
        data: convertToPlainObj(attendance),
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: formatError(error) };
  }
}

// Update a club or event (organizer only)
export async function updateClubEvent(
  id: string,
  type: 'club' | 'event',
  data: z.infer<typeof editClubEventSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    const validatedData = editClubEventSchema.parse(data);

    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({ where: { id } });
      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      // Build change history entries
      const changes: ChangeHistoryEntry[] = [];
      const now = new Date().toISOString();
      const changedBy = session.user.name || session.user.email || 'Unknown';

      if (validatedData.title !== club.title) {
        changes.push({
          field: 'title',
          oldValue: club.title,
          newValue: validatedData.title,
          changedAt: now,
          changedBy,
        });
      }
      if (validatedData.description !== club.description) {
        changes.push({
          field: 'description',
          oldValue: club.description.substring(0, 100),
          newValue: validatedData.description.substring(0, 100),
          changedAt: now,
          changedBy,
        });
      }
      if (validatedData.capacity !== club.capacity) {
        changes.push({
          field: 'capacity',
          oldValue: String(club.capacity),
          newValue: String(validatedData.capacity),
          changedAt: now,
          changedBy,
        });
      }
      if (validatedData.format !== club.format) {
        changes.push({
          field: 'format',
          oldValue: club.format,
          newValue: validatedData.format,
          changedAt: now,
          changedBy,
        });
      }
      if (
        new Date(validatedData.startDate).getTime() !==
        new Date(club.startDate).getTime()
      ) {
        changes.push({
          field: 'startDate',
          oldValue: new Date(club.startDate).toISOString(),
          newValue: new Date(validatedData.startDate).toISOString(),
          changedAt: now,
          changedBy,
        });
      }

      const existingHistory = parseChangeHistory(club.changeHistory);

      await prisma.readingClub.update({
        where: { id },
        data: {
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
          changeHistory: [...existingHistory, ...changes],
        },
      });

      // Notify participants if significant changes occurred
      if (changes.length > 0) {
        const registrations = await prisma.registration.findMany({
          where: { clubId: id, status: 'active' },
          include: {
            user: { select: { email: true, name: true } },
          },
        });

        for (const reg of registrations) {
          if (reg.user.email) {
            await sendParticipantNotification({
              userEmail: reg.user.email,
              userName: reg.user.name,
              eventTitle: validatedData.title,
              eventType: 'club',
              changes: changes.map(
                (c) => `${c.field}: "${c.oldValue}" → "${c.newValue}"`,
              ),
            });
          }
        }
      }

      revalidatePath('/user/my-clubs');
      revalidatePath(`/clubs/${id}`);

      return { success: true, message: 'Club updated successfully' };
    } else {
      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const changes: ChangeHistoryEntry[] = [];
      const now = new Date().toISOString();
      const changedBy = session.user.name || session.user.email || 'Unknown';

      if (validatedData.title !== event.title) {
        changes.push({
          field: 'title',
          oldValue: event.title,
          newValue: validatedData.title,
          changedAt: now,
          changedBy,
        });
      }
      if (validatedData.description !== event.description) {
        changes.push({
          field: 'description',
          oldValue: event.description.substring(0, 100),
          newValue: validatedData.description.substring(0, 100),
          changedAt: now,
          changedBy,
        });
      }
      if (validatedData.capacity !== event.capacity) {
        changes.push({
          field: 'capacity',
          oldValue: String(event.capacity),
          newValue: String(validatedData.capacity),
          changedAt: now,
          changedBy,
        });
      }
      if (validatedData.format !== event.format) {
        changes.push({
          field: 'format',
          oldValue: event.format,
          newValue: validatedData.format,
          changedAt: now,
          changedBy,
        });
      }
      if (
        new Date(validatedData.startDate).getTime() !==
        new Date(event.eventDate).getTime()
      ) {
        changes.push({
          field: 'eventDate',
          oldValue: new Date(event.eventDate).toISOString(),
          newValue: new Date(validatedData.startDate).toISOString(),
          changedAt: now,
          changedBy,
        });
      }

      const existingHistory = parseChangeHistory(event.changeHistory);

      await prisma.event.update({
        where: { id },
        data: {
          title: validatedData.title,
          purpose: validatedData.purpose,
          description: validatedData.description,
          eventDate: validatedData.startDate,
          capacity: validatedData.capacity,
          format: validatedData.format,
          address: validatedData.address || null,
          onlineLink: validatedData.onlineLink || null,
          bookIds: validatedData.bookIds,
          changeHistory: [...existingHistory, ...changes],
        },
      });

      if (changes.length > 0) {
        const registrations = await prisma.registration.findMany({
          where: { eventId: id, status: 'active' },
          include: {
            user: { select: { email: true, name: true } },
          },
        });

        for (const reg of registrations) {
          if (reg.user.email) {
            await sendParticipantNotification({
              userEmail: reg.user.email,
              userName: reg.user.name,
              eventTitle: validatedData.title,
              eventType: 'event',
              changes: changes.map(
                (c) => `${c.field}: "${c.oldValue}" → "${c.newValue}"`,
              ),
            });
          }
        }
      }

      revalidatePath('/user/my-clubs');
      revalidatePath(`/events/${id}`);

      return { success: true, message: 'Event updated successfully' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: formatError(error) };
  }
}

// Toggle publish/unpublish (isActive) for a club or event
export async function togglePublishClubEvent(
  id: string,
  type: 'club' | 'event',
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({ where: { id } });
      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const newStatus = !club.isActive;
      await prisma.readingClub.update({
        where: { id },
        data: { isActive: newStatus },
      });

      // Notify participants when unpublished
      if (!newStatus) {
        const registrations = await prisma.registration.findMany({
          where: { clubId: id, status: 'active' },
          include: {
            user: { select: { email: true, name: true } },
          },
        });

        for (const reg of registrations) {
          if (reg.user.email) {
            await sendParticipantNotification({
              userEmail: reg.user.email,
              userName: reg.user.name,
              eventTitle: club.title,
              eventType: 'club',
              changes: ['The reading club has been temporarily unpublished by the organizer.'],
            });
          }
        }
      }

      revalidatePath('/user/my-clubs');
      revalidatePath('/clubs');

      return {
        success: true,
        message: `Club ${newStatus ? 'published' : 'unpublished'} successfully`,
        data: { isActive: newStatus },
      };
    } else {
      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }

      const newStatus = !event.isActive;
      await prisma.event.update({
        where: { id },
        data: { isActive: newStatus },
      });

      if (!newStatus) {
        const registrations = await prisma.registration.findMany({
          where: { eventId: id, status: 'active' },
          include: {
            user: { select: { email: true, name: true } },
          },
        });

        for (const reg of registrations) {
          if (reg.user.email) {
            await sendParticipantNotification({
              userEmail: reg.user.email,
              userName: reg.user.name,
              eventTitle: event.title,
              eventType: 'event',
              changes: ['The event has been temporarily unpublished by the organizer.'],
            });
          }
        }
      }

      revalidatePath('/user/my-clubs');
      revalidatePath('/events');

      return {
        success: true,
        message: `Event ${newStatus ? 'published' : 'unpublished'} successfully`,
        data: { isActive: newStatus },
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Send a message to all active participants
export async function sendMessageToParticipants(
  id: string,
  type: 'club' | 'event',
  messageData: z.infer<typeof participantMessageSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    const validatedData = participantMessageSchema.parse(messageData);

    let eventTitle: string;

    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({
        where: { id },
        select: { creatorId: true, title: true },
      });
      if (!club || club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
      eventTitle = club.title;
    } else {
      const event = await prisma.event.findUnique({
        where: { id },
        select: { organizerId: true, title: true },
      });
      if (!event || event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
      eventTitle = event.title;
    }

    const registrations = await prisma.registration.findMany({
      where: {
        ...(type === 'club' ? { clubId: id } : { eventId: id }),
        status: 'active',
      },
      include: {
        user: { select: { email: true, name: true } },
      },
    });

    const senderName = session.user.name || 'Organizer';

    let sentCount = 0;
    for (const reg of registrations) {
      if (reg.user.email) {
        await sendOrganizerMessage({
          userEmail: reg.user.email,
          userName: reg.user.name,
          eventTitle,
          eventType: type,
          senderName,
          subject: validatedData.subject,
          message: validatedData.message,
        });
        sentCount++;
      }
    }

    return {
      success: true,
      message: `Message sent to ${sentCount} participant(s)`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: formatError(error) };
  }
}

// Get a specific club or event for editing (with full data)
export async function getClubEventForEdit(id: string, type: 'club' | 'event') {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be signed in' };
    }

    if (type === 'club') {
      const club = await prisma.readingClub.findUnique({
        where: { id },
        include: {
          creator: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });
      if (!club) return { success: false, message: 'Club not found' };
      if (club.creatorId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
      return { success: true, data: convertToPlainObj(club) };
    } else {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          organizer: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });
      if (!event) return { success: false, message: 'Event not found' };
      if (event.organizerId !== session.user.id) {
        return { success: false, message: 'Unauthorized' };
      }
      return { success: true, data: convertToPlainObj(event) };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
