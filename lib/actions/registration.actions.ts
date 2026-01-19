'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { registrationSchema } from '../validators';
import { z } from 'zod';
import { auth } from '@/auth';
import {
  sendRegistrationConfirmation,
  sendCancellationConfirmation,
} from '../email';

// Register for a club or event
export async function registerForClubOrEvent(
  data: z.infer<typeof registrationSchema>,
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to register',
      };
    }

    const validatedData = registrationSchema.parse(data);
    const { clubId, eventId } = validatedData;
    const userId = session.user.id;

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId,
        ...(clubId ? { clubId } : { eventId }),
        status: 'active',
      },
    });

    if (existingRegistration) {
      return {
        success: false,
        message: 'You are already registered for this club/event',
      };
    }

    // Verify the club or event exists and is active
    if (clubId) {
      const club = await prisma.readingClub.findUnique({
        where: { id: clubId },
        select: {
          id: true,
          capacity: true,
          isActive: true,
          memberIds: true,
          startDate: true,
        },
      });

      if (!club) {
        return {
          success: false,
          message: 'Reading club not found',
        };
      }

      if (!club.isActive) {
        return {
          success: false,
          message: 'This reading club is no longer active',
        };
      }

      // Check if club has already started
      if (new Date(club.startDate) < new Date()) {
        return {
          success: false,
          message: 'This reading club has already started',
        };
      }

      // Check if club is full
      if (club.memberIds.length >= club.capacity) {
        return {
          success: false,
          message: 'This reading club is full',
        };
      }

      // Create registration and update memberIds
      const [registration] = await prisma.$transaction([
        prisma.registration.create({
          data: {
            userId,
            clubId,
            status: 'active',
          },
          include: {
            club: {
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
            },
          },
        }),
        prisma.readingClub.update({
          where: { id: clubId },
          data: {
            memberIds: {
              push: userId,
            },
          },
        }),
      ]);

      revalidatePath('/clubs');
      revalidatePath(`/clubs/${clubId}`);
      revalidatePath('/user/my-registrations');

      // Send confirmation email
      if (session.user.email && registration.club) {
        await sendRegistrationConfirmation({
          userEmail: session.user.email,
          userName: session.user.name || 'Member',
          eventTitle: registration.club.title,
          eventType: 'club',
          eventDate: new Date(registration.club.startDate),
          eventFormat: registration.club.format,
          eventLink: registration.club.onlineLink,
        });
      }

      return {
        success: true,
        message: 'Successfully registered for the reading club!',
        data: convertToPlainObj(registration),
      };
    } else if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          capacity: true,
          isActive: true,
          attendeeIds: true,
          eventDate: true,
        },
      });

      if (!event) {
        return {
          success: false,
          message: 'Event not found',
        };
      }

      if (!event.isActive) {
        return {
          success: false,
          message: 'This event is no longer active',
        };
      }

      // Check if event has already occurred
      if (new Date(event.eventDate) < new Date()) {
        return {
          success: false,
          message: 'This event has already occurred',
        };
      }

      // Check if event is full
      if (event.attendeeIds.length >= event.capacity) {
        return {
          success: false,
          message: 'This event is full',
        };
      }

      // Create registration and update attendeeIds
      const [registration] = await prisma.$transaction([
        prisma.registration.create({
          data: {
            userId,
            eventId,
            status: 'active',
          },
          include: {
            event: {
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
            },
          },
        }),
        prisma.event.update({
          where: { id: eventId },
          data: {
            attendeeIds: {
              push: userId,
            },
          },
        }),
      ]);

      revalidatePath('/events');
      revalidatePath(`/events/${eventId}`);
      revalidatePath('/user/my-registrations');

      // Send confirmation email
      if (session.user.email && registration.event) {
        await sendRegistrationConfirmation({
          userEmail: session.user.email,
          userName: session.user.name || 'Attendee',
          eventTitle: registration.event.title,
          eventType: 'event',
          eventDate: new Date(registration.event.eventDate),
          eventFormat: registration.event.format,
          eventLink: registration.event.onlineLink,
        });
      }

      return {
        success: true,
        message: 'Successfully registered for the event!',
        data: convertToPlainObj(registration),
      };
    }

    return {
      success: false,
      message: 'Invalid registration data',
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

// Cancel registration
export async function cancelRegistration(
  registrationId: string,
  reason?: string,
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to cancel registration',
      };
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        club: true,
        event: true,
      },
    });

    if (!registration) {
      return {
        success: false,
        message: 'Registration not found',
      };
    }

    if (registration.userId !== session.user.id) {
      return {
        success: false,
        message: 'You can only cancel your own registrations',
      };
    }

    if (registration.status === 'cancelled') {
      return {
        success: false,
        message: 'Registration is already cancelled',
      };
    }

    // Check 24-hour cancellation deadline
    const eventDate = registration.clubId
      ? registration.club?.startDate
      : registration.event?.eventDate;

    if (eventDate) {
      const hoursUntilEvent =
        (new Date(eventDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60);

      if (hoursUntilEvent < 24 && hoursUntilEvent > 0) {
        return {
          success: false,
          message:
            'Cannot cancel within 24 hours of the event/club start time. Please contact the organizer directly.',
        };
      }
    }

    // Update registration status and remove user from memberIds/attendeeIds
    // Note: Cancellation reason is logged but not stored in current schema
    // To store it, add a 'cancellationReason' field to the Registration model
    if (reason) {
      console.log(
        `Registration ${registrationId} cancelled. Reason: ${reason}`,
      );
    }

    if (registration.clubId) {
      await prisma.$transaction([
        prisma.registration.update({
          where: { id: registrationId },
          data: {
            status: 'cancelled',
            cancelledAt: new Date(),
          },
        }),
        prisma.readingClub.update({
          where: { id: registration.clubId },
          data: {
            memberIds: {
              set: registration.club!.memberIds.filter(
                (id: string) => id !== session.user.id,
              ),
            },
          },
        }),
      ]);

      revalidatePath('/clubs');
      revalidatePath(`/clubs/${registration.clubId}`);
    } else if (registration.eventId) {
      await prisma.$transaction([
        prisma.registration.update({
          where: { id: registrationId },
          data: {
            status: 'cancelled',
            cancelledAt: new Date(),
          },
        }),
        prisma.event.update({
          where: { id: registration.eventId },
          data: {
            attendeeIds: {
              set: registration.event!.attendeeIds.filter(
                (id: string) => id !== session.user.id,
              ),
            },
          },
        }),
      ]);

      revalidatePath('/events');
      revalidatePath(`/events/${registration.eventId}`);
    }

    revalidatePath('/user/my-registrations');

    // Send cancellation confirmation email
    const eventTitle = registration.clubId
      ? registration.club?.title
      : registration.event?.title;
    const eventType = registration.clubId ? 'club' : 'event';

    if (session.user.email && eventTitle) {
      await sendCancellationConfirmation({
        userEmail: session.user.email,
        userName: session.user.name || 'User',
        eventTitle,
        eventType,
      });
    }

    return {
      success: true,
      message: 'Registration cancelled successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user registrations
export async function getUserRegistrations() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in',
      };
    }

    const registrations = await prisma.registration.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        club: {
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
        },
        event: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: convertToPlainObj(registrations),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Check if user is registered
export async function checkUserRegistration(clubId?: string, eventId?: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: true,
        isRegistered: false,
      };
    }

    const registration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        ...(clubId ? { clubId } : { eventId }),
        status: 'active',
      },
    });

    return {
      success: true,
      isRegistered: !!registration,
      registrationId: registration?.id,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Check if registration can be cancelled (24-hour deadline)
export async function canCancelRegistration(registrationId: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        canCancel: false,
        message: 'You must be signed in',
      };
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        club: {
          select: {
            startDate: true,
          },
        },
        event: {
          select: {
            eventDate: true,
          },
        },
      },
    });

    if (!registration) {
      return {
        success: false,
        canCancel: false,
        message: 'Registration not found',
      };
    }

    if (registration.userId !== session.user.id) {
      return {
        success: false,
        canCancel: false,
        message: 'Unauthorized',
      };
    }

    if (registration.status === 'cancelled') {
      return {
        success: true,
        canCancel: false,
        message: 'Already cancelled',
      };
    }

    // Check 24-hour deadline
    const eventDate = registration.clubId
      ? registration.club?.startDate
      : registration.event?.eventDate;

    if (eventDate) {
      const hoursUntilEvent =
        (new Date(eventDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60);

      if (hoursUntilEvent < 24 && hoursUntilEvent > 0) {
        return {
          success: true,
          canCancel: false,
          message: 'Cannot cancel within 24 hours of start time',
          hoursRemaining: Math.floor(hoursUntilEvent),
        };
      }

      // Already started
      if (hoursUntilEvent < 0) {
        return {
          success: true,
          canCancel: false,
          message: 'Event/club has already started',
        };
      }
    }

    return {
      success: true,
      canCancel: true,
    };
  } catch (error) {
    return {
      success: false,
      canCancel: false,
      message: formatError(error),
    };
  }
}
