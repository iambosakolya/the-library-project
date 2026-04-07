'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj } from '@/lib/utils';

// ── In-memory cache layer ────────────────────────────

type CacheEntry<T> = { data: T; expiresAt: number };
const cache = new Map<string, CacheEntry<unknown>>();

function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > Date.now()) {
    return Promise.resolve(entry.data);
  }
  return fn().then((data) => {
    cache.set(key, { data, expiresAt: Date.now() + ttlMs });
    return data;
  });
}

const FIVE_MIN = 5 * 60 * 1000;
const ONE_MIN = 60 * 1000;

// ── Helpers ──────────────────────────────────────────

function periodToDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now.getTime() - 7 * 86_400_000);
    case 'month':
      return new Date(now.getTime() - 30 * 86_400_000);
    case 'year':
      return new Date(now.getTime() - 365 * 86_400_000);
    default:
      return new Date(now.getTime() - 30 * 86_400_000);
  }
}

// ── Trending Books ───────────────────────────────────

type TrendingRow = {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  images: string[];
  price: unknown;
  rating: unknown;
  numreviews: number;
  total_sold: bigint;
  review_count: bigint;
};

export async function getTrendingBooks(period = 'month', limit = 8) {
  const since = periodToDate(period);
  return cached(`trending_books_${period}_${limit}`, FIVE_MIN, async () => {
    const rows: TrendingRow[] = await prisma.$queryRaw`
      SELECT p."id", p."name", p."slug", p."author", p."category",
             p."images", p."price", p."rating", p."numReviews" as numreviews,
             COALESCE(s.total_sold, 0)::bigint as total_sold,
             COALESCE(r.review_count, 0)::bigint as review_count
      FROM "Product" p
      LEFT JOIN (
        SELECT oi."productId", SUM(oi."quantity")::bigint as total_sold
        FROM "OrderItem" oi
        JOIN "Order" o ON o."id" = oi."orderId"
        WHERE o."createdAt" >= ${since}
        GROUP BY oi."productId"
      ) s ON s."productId" = p."id"
      LEFT JOIN (
        SELECT "productId", COUNT(*)::bigint as review_count
        FROM "Review"
        WHERE "createdAt" >= ${since}
        GROUP BY "productId"
      ) r ON r."productId" = p."id"
      ORDER BY (COALESCE(s.total_sold, 0) * 3 + COALESCE(r.review_count, 0) * 2 + p."numReviews") DESC
      LIMIT ${limit}
    `;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      author: row.author,
      category: row.category,
      image: row.images?.[0] ?? '/images/placeholder.jpg',
      price: Number(row.price),
      rating: Number(row.rating),
      numReviews: row.numreviews,
      totalSold: Number(row.total_sold),
      recentReviews: Number(row.review_count),
    }));
  });
}

// ── Most Active Reading Clubs ────────────────────────

export async function getActiveClubs(limit = 6) {
  return cached(`active_clubs_${limit}`, FIVE_MIN, async () => {
    const clubs = await prisma.readingClub.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        purpose: true,
        description: true,
        memberIds: true,
        capacity: true,
        format: true,
        startDate: true,
        bookIds: true,
        creator: { select: { name: true } },
        registrations: { where: { status: 'active' }, select: { id: true } },
      },
    });

    return clubs.map((c) =>
      convertToPlainObj({
        id: c.id,
        title: c.title,
        purpose: c.purpose,
        description:
          c.description.slice(0, 120) + (c.description.length > 120 ? '…' : ''),
        memberCount: c.memberIds.length,
        capacity: c.capacity,
        format: c.format,
        startDate: c.startDate,
        bookCount: c.bookIds.length,
        creatorName: c.creator.name,
        activeRegistrations: c.registrations.length,
      }),
    );
  });
}

// ── Upcoming Events ──────────────────────────────────

export async function getUpcomingEvents(limit = 8) {
  return cached(`upcoming_events_${limit}`, FIVE_MIN, async () => {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: { isActive: true, eventDate: { gte: now } },
      orderBy: { eventDate: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
        capacity: true,
        format: true,
        attendeeIds: true,
        organizer: { select: { name: true } },
        bookIds: true,
      },
    });

    return events.map((e) =>
      convertToPlainObj({
        id: e.id,
        title: e.title,
        description:
          e.description.slice(0, 100) + (e.description.length > 100 ? '…' : ''),
        eventDate: e.eventDate,
        capacity: e.capacity,
        format: e.format,
        attendeeCount: e.attendeeIds.length,
        organizerName: e.organizer.name,
        bookCount: e.bookIds.length,
      }),
    );
  });
}

// ── Genre Popularity ─────────────────────────────────

type GenreRow = { category: string; count: bigint; revenue: unknown };

export async function getGenrePopularity(period = 'month') {
  const since = periodToDate(period);
  return cached(`genre_popularity_${period}`, FIVE_MIN, async () => {
    const rows: GenreRow[] = await prisma.$queryRaw`
      SELECT p."category", COUNT(DISTINCT p."id")::bigint as count,
             COALESCE(SUM(oi."price" * oi."quantity"), 0) as revenue
      FROM "Product" p
      LEFT JOIN "OrderItem" oi ON oi."productId" = p."id"
      LEFT JOIN "Order" o ON o."id" = oi."orderId" AND o."createdAt" >= ${since}
      GROUP BY p."category"
      ORDER BY count DESC
    `;

    return rows.map((r) => ({
      genre: r.category,
      bookCount: Number(r.count),
      revenue: Number(r.revenue),
    }));
  });
}

// ── Community Activity Feed ──────────────────────────

export async function getActivityFeed(limit = 15) {
  return cached(`activity_feed_${limit}`, ONE_MIN, async () => {
    const [recentReviews, recentRegistrations, recentOrders] =
      await Promise.all([
        prisma.review.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            rating: true,
            createdAt: true,
            user: { select: { name: true } },
            product: { select: { name: true, slug: true } },
          },
        }),
        prisma.registration.findMany({
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            user: { select: { name: true } },
            club: { select: { title: true } },
            event: { select: { title: true } },
          },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            orderitems: { select: { name: true }, take: 1 },
          },
        }),
      ]);

    type FeedItem = {
      id: string;
      type: string;
      message: string;
      timestamp: Date;
    };

    const feed: FeedItem[] = [];

    for (const r of recentReviews) {
      feed.push({
        id: `review-${r.id}`,
        type: 'review',
        message: `${r.user.name} rated "${r.product.name}" ${'★'.repeat(r.rating)}`,
        timestamp: r.createdAt,
      });
    }

    for (const reg of recentRegistrations) {
      const target = reg.club?.title ?? reg.event?.title ?? 'an activity';
      feed.push({
        id: `reg-${reg.id}`,
        type: 'registration',
        message: `${reg.user.name} joined "${target}"`,
        timestamp: reg.createdAt,
      });
    }

    for (const o of recentOrders) {
      const bookName = o.orderitems[0]?.name ?? 'a book';
      feed.push({
        id: `order-${o.id}`,
        type: 'purchase',
        message: `Someone purchased "${bookName}"`,
        timestamp: o.createdAt,
      });
    }

    feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return convertToPlainObj(feed.slice(0, limit));
  });
}

// ── Top Books of Month/Year ──────────────────────────

type TopBookRow = {
  id: string;
  name: string;
  slug: string;
  author: string;
  images: string[];
  price: unknown;
  rating: unknown;
  total_sold: bigint;
};

export async function getTopBooks(period = 'month', limit = 5) {
  const since = periodToDate(period);
  return cached(`top_books_${period}_${limit}`, FIVE_MIN, async () => {
    const rows: TopBookRow[] = await prisma.$queryRaw`
      SELECT p."id", p."name", p."slug", p."author", p."images",
             p."price", p."rating",
             SUM(oi."quantity")::bigint as total_sold
      FROM "OrderItem" oi
      JOIN "Product" p ON p."id" = oi."productId"
      JOIN "Order" o ON o."id" = oi."orderId"
      WHERE o."createdAt" >= ${since}
      GROUP BY p."id", p."name", p."slug", p."author", p."images", p."price", p."rating"
      ORDER BY total_sold DESC
      LIMIT ${limit}
    `;

    return rows.map((r, idx) => ({
      rank: idx + 1,
      id: r.id,
      name: r.name,
      slug: r.slug,
      author: r.author,
      image: r.images?.[0] ?? '/images/placeholder.jpg',
      price: Number(r.price),
      rating: Number(r.rating),
      totalSold: Number(r.total_sold),
    }));
  });
}

// ── Community Stats (summary cards) ──────────────────

export async function getCommunityStats() {
  return cached('community_stats', FIVE_MIN, async () => {
    const [
      totalBooks,
      totalMembers,
      activeClubs,
      upcomingEvents,
      totalReviews,
      totalOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.readingClub.count({ where: { isActive: true } }),
      prisma.event.count({
        where: { isActive: true, eventDate: { gte: new Date() } },
      }),
      prisma.review.count(),
      prisma.order.count(),
    ]);

    return {
      totalBooks,
      totalMembers,
      activeClubs,
      upcomingEvents,
      totalReviews,
      totalOrders,
    };
  });
}

// ── Reading Trends Over Time ─────────────────────────

type DateCount = { date: string; count: bigint };

export async function getReadingTrendsPublic(period = 'month') {
  const since = periodToDate(period);
  return cached(`reading_trends_public_${period}`, FIVE_MIN, async () => {
    const [orderTrend, reviewTrend] = await Promise.all([
      prisma.$queryRaw<DateCount[]>`
        SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
        FROM "Order"
        WHERE "createdAt" >= ${since}
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
      prisma.$queryRaw<DateCount[]>`
        SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
        FROM "Review"
        WHERE "createdAt" >= ${since}
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
    ]);

    return {
      purchases: orderTrend.map((r) => ({
        date: r.date.toString().slice(0, 10),
        count: Number(r.count),
      })),
      reviews: reviewTrend.map((r) => ({
        date: r.date.toString().slice(0, 10),
        count: Number(r.count),
      })),
    };
  });
}
