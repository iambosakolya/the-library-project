'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj } from '@/lib/utils';

// ── In-memory cache layer (same pattern as public-analytics) ──

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

// ── Helpers ──

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

// ── 1. Most Discussed Books ──

type DiscussedBookRow = {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  images: string[];
  price: unknown;
  rating: unknown;
  review_count: bigint;
  avg_rating: unknown;
  total_sold: bigint;
};

export async function getMostDiscussedBooks(
  period = 'month',
  genre?: string,
  limit = 10,
) {
  const since = periodToDate(period);
  const key = `discussed_books_${period}_${genre ?? 'all'}_${limit}`;

  return cached(key, FIVE_MIN, async () => {
    const genreFilter = genre
      ? `AND p."category" = '${genre.replace(/'/g, "''")}'`
      : '';

    const rows: DiscussedBookRow[] = await prisma.$queryRawUnsafe(
      `
      SELECT p."id", p."name", p."slug", p."author", p."category",
             p."images", p."price", p."rating",
             COUNT(r."id")::bigint AS review_count,
             AVG(r."rating") AS avg_rating,
             COALESCE(s.total_sold, 0)::bigint AS total_sold
      FROM "Product" p
      JOIN "Review" r ON r."productId" = p."id" AND r."createdAt" >= $1
      LEFT JOIN (
        SELECT oi."productId", SUM(oi."quantity")::bigint AS total_sold
        FROM "OrderItem" oi
        JOIN "Order" o ON o."id" = oi."orderId"
        WHERE o."createdAt" >= $1
        GROUP BY oi."productId"
      ) s ON s."productId" = p."id"
      WHERE 1=1 ${genreFilter}
      GROUP BY p."id", p."name", p."slug", p."author", p."category",
               p."images", p."price", p."rating", s.total_sold
      ORDER BY review_count DESC
      LIMIT $2
    `,
      since,
      limit,
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      author: row.author,
      category: row.category,
      image: row.images?.[0] ?? '/images/placeholder.jpg',
      price: Number(row.price),
      rating: Number(row.rating),
      reviewCount: Number(row.review_count),
      avgRating: Number(Number(row.avg_rating).toFixed(2)),
      totalSold: Number(row.total_sold),
    }));
  });
}

// ── 2. Rating Distribution by Genre ──

type RatingDistRow = {
  category: string;
  rating: number;
  count: bigint;
};

export async function getRatingDistribution(period = 'month') {
  const since = periodToDate(period);

  return cached(`rating_distribution_${period}`, FIVE_MIN, async () => {
    const rows: RatingDistRow[] = await prisma.$queryRaw`
      SELECT p."category", r."rating", COUNT(*)::bigint AS count
      FROM "Review" r
      JOIN "Product" p ON p."id" = r."productId"
      WHERE r."createdAt" >= ${since}
      GROUP BY p."category", r."rating"
      ORDER BY p."category", r."rating"
    `;

    // Group by genre
    const genreMap = new Map<
      string,
      { genre: string; ratings: Record<number, number>; total: number }
    >();

    for (const row of rows) {
      if (!genreMap.has(row.category)) {
        genreMap.set(row.category, {
          genre: row.category,
          ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          total: 0,
        });
      }
      const entry = genreMap.get(row.category)!;
      entry.ratings[row.rating] = Number(row.count);
      entry.total += Number(row.count);
    }

    return Array.from(genreMap.values()).sort((a, b) => b.total - a.total);
  });
}

// ── 3. Author Spotlight ──

type AuthorRow = {
  author: string;
  book_count: bigint;
  total_reviews: bigint;
  avg_rating: unknown;
  total_sold: bigint;
};

export async function getAuthorSpotlight(period = 'month', limit = 10) {
  const since = periodToDate(period);

  return cached(`author_spotlight_${period}_${limit}`, FIVE_MIN, async () => {
    const rows: AuthorRow[] = await prisma.$queryRaw`
      SELECT p."author",
             COUNT(DISTINCT p."id")::bigint AS book_count,
             COUNT(r."id")::bigint AS total_reviews,
             COALESCE(AVG(r."rating"), 0) AS avg_rating,
             COALESCE(SUM(s.total_sold), 0)::bigint AS total_sold
      FROM "Product" p
      LEFT JOIN "Review" r ON r."productId" = p."id" AND r."createdAt" >= ${since}
      LEFT JOIN (
        SELECT oi."productId", SUM(oi."quantity")::bigint AS total_sold
        FROM "OrderItem" oi
        JOIN "Order" o ON o."id" = oi."orderId"
        WHERE o."createdAt" >= ${since}
        GROUP BY oi."productId"
      ) s ON s."productId" = p."id"
      GROUP BY p."author"
      HAVING COUNT(r."id") > 0
      ORDER BY total_reviews DESC
      LIMIT ${limit}
    `;

    return rows.map((row) => ({
      author: row.author,
      bookCount: Number(row.book_count),
      totalReviews: Number(row.total_reviews),
      avgRating: Number(Number(row.avg_rating).toFixed(2)),
      totalSold: Number(row.total_sold),
    }));
  });
}

// ── 4. Seasonality Trends (reviews & purchases by month) ──

type MonthlyRow = {
  month_num: number;
  month_name: string;
  count: bigint;
};

export async function getSeasonalityTrends() {
  return cached('seasonality_trends', FIVE_MIN, async () => {
    const [reviewsByMonth, purchasesByMonth] = await Promise.all([
      prisma.$queryRaw<MonthlyRow[]>`
        SELECT EXTRACT(MONTH FROM "createdAt")::int AS month_num,
               TO_CHAR("createdAt", 'Mon') AS month_name,
               COUNT(*)::bigint AS count
        FROM "Review"
        GROUP BY month_num, month_name
        ORDER BY month_num
      `,
      prisma.$queryRaw<MonthlyRow[]>`
        SELECT EXTRACT(MONTH FROM "createdAt")::int AS month_num,
               TO_CHAR("createdAt", 'Mon') AS month_name,
               COUNT(*)::bigint AS count
        FROM "Order"
        GROUP BY month_num, month_name
        ORDER BY month_num
      `,
    ]);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months.map((month, idx) => {
      const reviewRow = reviewsByMonth.find((r) => r.month_num === idx + 1);
      const purchaseRow = purchasesByMonth.find((r) => r.month_num === idx + 1);
      return {
        month,
        reviews: reviewRow ? Number(reviewRow.count) : 0,
        purchases: purchaseRow ? Number(purchaseRow.count) : 0,
      };
    });
  });
}

// ── 5. Book Discovery Paths (reviews → purchases correlation) ──

type DiscoveryRow = {
  path: string;
  count: bigint;
};

export async function getBookDiscoveryPaths() {
  return cached('book_discovery_paths', FIVE_MIN, async () => {
    // Analyze: users who reviewed a book THEN bought another book by same author
    // Also: books bought after being in clubs, events
    const [
      reviewThenBuy,
      clubBooks,
      eventBooks,
      directPurchases,
      highRatedPurchases,
    ] = await Promise.all([
      // Users who reviewed before purchasing
      prisma.$queryRaw<DiscoveryRow[]>`
        SELECT 'Reviewed then Purchased'::text AS path,
               COUNT(DISTINCT o."userId")::bigint AS count
        FROM "Order" o
        JOIN "OrderItem" oi ON oi."orderId" = o."id"
        JOIN "Review" r ON r."productId" = oi."productId" AND r."userId" = o."userId"
        WHERE r."createdAt" < o."createdAt"
      `,
      // Books associated with reading clubs
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(DISTINCT unnest)::bigint AS count
        FROM "ReadingClub", LATERAL unnest("bookIds")
        WHERE "isActive" = true
      `,
      // Books associated with events
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(DISTINCT unnest)::bigint AS count
        FROM "Event", LATERAL unnest("bookIds")
        WHERE "isActive" = true
      `,
      // Direct purchases (no prior review)
      prisma.$queryRaw<DiscoveryRow[]>`
        SELECT 'Direct Purchase'::text AS path,
               COUNT(DISTINCT o."userId")::bigint AS count
        FROM "Order" o
        JOIN "OrderItem" oi ON oi."orderId" = o."id"
        LEFT JOIN "Review" r ON r."productId" = oi."productId" AND r."userId" = o."userId"
          AND r."createdAt" < o."createdAt"
        WHERE r."id" IS NULL
      `,
      // Purchases of highly-rated books (4+ avg rating)
      prisma.$queryRaw<DiscoveryRow[]>`
        SELECT 'High-Rated Books'::text AS path,
               COUNT(DISTINCT oi."orderId")::bigint AS count
        FROM "OrderItem" oi
        JOIN "Product" p ON p."id" = oi."productId"
        WHERE p."rating" >= 4.0
      `,
    ]);

    return [
      {
        path: 'Reviewed then Purchased',
        count: Number(reviewThenBuy[0]?.count ?? 0),
      },
      {
        path: 'Club Recommended',
        count: Number(clubBooks[0]?.count ?? 0),
      },
      {
        path: 'Event Featured',
        count: Number(eventBooks[0]?.count ?? 0),
      },
      {
        path: 'Direct Purchase',
        count: Number(directPurchases[0]?.count ?? 0),
      },
      {
        path: 'High-Rated Discovery',
        count: Number(highRatedPurchases[0]?.count ?? 0),
      },
    ];
  });
}

// ── 6. Club Reading Preferences ──

export async function getClubReadingPreferences(limit = 10) {
  return cached(`club_reading_prefs_${limit}`, FIVE_MIN, async () => {
    // Get books that appear most in clubs + their genres
    const clubs = await prisma.readingClub.findMany({
      where: { isActive: true },
      select: { bookIds: true, title: true, memberIds: true },
    });

    // Count book frequencies across all clubs
    const bookFrequency = new Map<string, number>();
    for (const club of clubs) {
      for (const bookId of club.bookIds) {
        bookFrequency.set(bookId, (bookFrequency.get(bookId) || 0) + 1);
      }
    }

    // Get top book IDs
    const topBookIds = Array.from(bookFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (topBookIds.length === 0) {
      return { topBooks: [], genreBreakdown: [], clubCount: clubs.length };
    }

    // Fetch book details
    const books = await prisma.product.findMany({
      where: { id: { in: topBookIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        author: true,
        category: true,
        images: true,
        rating: true,
      },
    });

    // Genre breakdown from club books
    const genreCounts = new Map<string, number>();
    for (const book of books) {
      const freq = bookFrequency.get(book.id) || 1;
      genreCounts.set(
        book.category,
        (genreCounts.get(book.category) || 0) + freq,
      );
    }

    const topBooks = books
      .map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        author: b.author,
        category: b.category,
        image: b.images?.[0] ?? '/images/placeholder.jpg',
        rating: Number(b.rating),
        clubAppearances: bookFrequency.get(b.id) || 0,
      }))
      .sort((a, b) => b.clubAppearances - a.clubAppearances);

    const genreBreakdown = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    return convertToPlainObj({
      topBooks,
      genreBreakdown,
      clubCount: clubs.length,
    });
  });
}

// ── 7. Rising Books (velocity-based: recent growth vs previous period) ──

type RisingRow = {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  images: string[];
  price: unknown;
  rating: unknown;
  recent_reviews: bigint;
  previous_reviews: bigint;
  recent_sales: bigint;
};

export async function getRisingBooks(period = 'month', limit = 8) {
  const since = periodToDate(period);
  const periodMs = Date.now() - since.getTime();
  const previousStart = new Date(since.getTime() - periodMs);

  return cached(`rising_books_${period}_${limit}`, FIVE_MIN, async () => {
    const rows: RisingRow[] = await prisma.$queryRaw`
      SELECT p."id", p."name", p."slug", p."author", p."category",
             p."images", p."price", p."rating",
             COALESCE(curr.recent_reviews, 0)::bigint AS recent_reviews,
             COALESCE(prev.previous_reviews, 0)::bigint AS previous_reviews,
             COALESCE(sales.recent_sales, 0)::bigint AS recent_sales
      FROM "Product" p
      LEFT JOIN (
        SELECT "productId", COUNT(*)::bigint AS recent_reviews
        FROM "Review"
        WHERE "createdAt" >= ${since}
        GROUP BY "productId"
      ) curr ON curr."productId" = p."id"
      LEFT JOIN (
        SELECT "productId", COUNT(*)::bigint AS previous_reviews
        FROM "Review"
        WHERE "createdAt" >= ${previousStart} AND "createdAt" < ${since}
        GROUP BY "productId"
      ) prev ON prev."productId" = p."id"
      LEFT JOIN (
        SELECT oi."productId", SUM(oi."quantity")::bigint AS recent_sales
        FROM "OrderItem" oi
        JOIN "Order" o ON o."id" = oi."orderId"
        WHERE o."createdAt" >= ${since}
        GROUP BY oi."productId"
      ) sales ON sales."productId" = p."id"
      WHERE COALESCE(curr.recent_reviews, 0) > 0
      ORDER BY (
        COALESCE(curr.recent_reviews, 0) * 3
        + COALESCE(sales.recent_sales, 0) * 2
        - COALESCE(prev.previous_reviews, 0)
      ) DESC
      LIMIT ${limit}
    `;

    return rows.map((row) => {
      const recent = Number(row.recent_reviews);
      const previous = Number(row.previous_reviews);
      const growth =
        previous > 0
          ? Math.round(((recent - previous) / previous) * 100)
          : recent > 0
            ? 100
            : 0;

      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        author: row.author,
        category: row.category,
        image: row.images?.[0] ?? '/images/placeholder.jpg',
        price: Number(row.price),
        rating: Number(row.rating),
        recentReviews: recent,
        previousReviews: previous,
        recentSales: Number(row.recent_sales),
        growthPercent: growth,
      };
    });
  });
}

// ── 8. Get All Reading Insights (for SSR) ──

export async function getReadingInsightsData(period = 'month', genre?: string) {
  const [
    mostDiscussed,
    ratingDistribution,
    authorSpotlight,
    seasonality,
    discoveryPaths,
    clubPreferences,
    risingBooks,
  ] = await Promise.all([
    getMostDiscussedBooks(period, genre),
    getRatingDistribution(period),
    getAuthorSpotlight(period),
    getSeasonalityTrends(),
    getBookDiscoveryPaths(),
    getClubReadingPreferences(),
    getRisingBooks(period),
  ]);

  return {
    mostDiscussed,
    ratingDistribution,
    authorSpotlight,
    seasonality,
    discoveryPaths,
    clubPreferences,
    risingBooks,
  };
}

// ── Types for export ──

export type ReadingInsightsData = Awaited<
  ReturnType<typeof getReadingInsightsData>
>;
export type MostDiscussedBook = Awaited<
  ReturnType<typeof getMostDiscussedBooks>
>[number];
export type RatingDistributionItem = Awaited<
  ReturnType<typeof getRatingDistribution>
>[number];
export type AuthorSpotlightItem = Awaited<
  ReturnType<typeof getAuthorSpotlight>
>[number];
export type SeasonalityItem = Awaited<
  ReturnType<typeof getSeasonalityTrends>
>[number];
export type DiscoveryPathItem = Awaited<
  ReturnType<typeof getBookDiscoveryPaths>
>[number];
export type ClubReadingPreferencesData = Awaited<
  ReturnType<typeof getClubReadingPreferences>
>;
export type RisingBook = Awaited<ReturnType<typeof getRisingBooks>>[number];
