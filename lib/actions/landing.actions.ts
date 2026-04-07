'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj } from '@/lib/utils';

export async function getLandingPageData() {
  try {
    const now = new Date();

    const [
      upcomingEvents,
      activeClubs,
      totalEvents,
      totalClubs,
      totalMembers,
      totalBooks,
    ] = await Promise.all([
      // Upcoming events (next 6, sorted by date)
      prisma.event.findMany({
        where: {
          isActive: true,
          eventDate: { gte: now },
        },
        orderBy: { eventDate: 'asc' },
        take: 6,
        include: {
          organizer: {
            select: { id: true, name: true, email: true },
          },
        },
      }),

      // Active reading clubs (next 6, sorted by start date)
      prisma.readingClub.findMany({
        where: { isActive: true },
        orderBy: { startDate: 'desc' },
        take: 6,
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      }),

      // Stats: total events
      prisma.event.count({ where: { isActive: true } }),

      // Stats: total clubs
      prisma.readingClub.count({ where: { isActive: true } }),

      // Stats: total unique members (users who are members of at least one club or event)
      prisma.user.count(),

      // Stats: total books discussed (unique bookIds across clubs and events)
      prisma.readingClub.findMany({
        where: { isActive: true },
        select: { bookIds: true },
      }),
    ]);

    // Calculate total unique books discussed
    const bookIdSet = new Set<string>();
    totalBooks.forEach((club) =>
      club.bookIds.forEach((id) => bookIdSet.add(id)),
    );
    // Also count books from events
    const eventBooks = await prisma.event.findMany({
      where: { isActive: true },
      select: { bookIds: true },
    });
    eventBooks.forEach((event) =>
      event.bookIds.forEach((id) => bookIdSet.add(id)),
    );

    return {
      success: true,
      events: convertToPlainObj(upcomingEvents),
      clubs: convertToPlainObj(activeClubs),
      stats: {
        totalClubs,
        totalEvents,
        totalMembers,
        totalBooksDiscussed: bookIdSet.size,
      },
    };
  } catch (error) {
    console.error('Failed to fetch landing page data:', error);
    return {
      success: false,
      events: [],
      clubs: [],
      stats: {
        totalClubs: 0,
        totalEvents: 0,
        totalMembers: 0,
        totalBooksDiscussed: 0,
      },
    };
  }
}
