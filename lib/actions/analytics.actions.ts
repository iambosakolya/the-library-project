'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { Prisma } from '@/src/generated/prisma';

// ── Row types for raw SQL results ───────────────────

type DateCount = { date: string; count: bigint };
type DateCountRevenue = {
  date: string;
  count: bigint;
  revenue: Prisma.Decimal;
};
type CategoryRevenue = {
  category: string;
  revenue: Prisma.Decimal;
  count: bigint;
};
type BookRow = {
  name: string;
  author: string;
  quantity: bigint;
  revenue: Prisma.Decimal;
};
type RatingRow = { rating: number; count: bigint };
type StatusCount = { status: string; count: bigint };
type FormatCount = { format: string; count: bigint };
type ClubRequestRow = { date: string; count: bigint; type: string };
type TopClubRow = { title: string; member_count: number };
type TopReviewerRow = {
  name: string;
  review_count: bigint;
  avg_rating: number;
};
type VoteRow = { is_helpful: boolean; count: bigint };
type TopBuyerRow = {
  name: string;
  order_count: bigint;
  total_spent: Prisma.Decimal;
};
type HeatmapRow = { day_of_week: number; hour: number; count: bigint };
type RoleRow = { role: string; count: bigint };
type CountOnly = { count: bigint };

// ── Helpers ──────────────────────────────────────────

function dateRange(period: string, customStart?: string, customEnd?: string) {
  const end = customEnd ? new Date(customEnd) : new Date();
  let start: Date;

  switch (period) {
    case 'last_7':
      start = new Date(end.getTime() - 7 * 86_400_000);
      break;
    case 'last_30':
      start = new Date(end.getTime() - 30 * 86_400_000);
      break;
    case 'last_90':
      start = new Date(end.getTime() - 90 * 86_400_000);
      break;
    case 'custom':
      start = customStart
        ? new Date(customStart)
        : new Date(end.getTime() - 30 * 86_400_000);
      break;
    default:
      start = new Date(end.getTime() - 30 * 86_400_000);
  }

  return { start, end };
}

function generateDailyBuckets(start: Date, end: Date) {
  const buckets: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    buckets.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return buckets;
}

function buildDateMap<T extends { date: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((r) => [r.date.toString().slice(0, 10), r]));
}

// ── Reading Trends ───────────────────────────────────

export async function getReadingTrends(
  period: string,
  customStart?: string,
  customEnd?: string,
) {
  const { start, end } = dateRange(period, customStart, customEnd);

  // Orders over time (daily sales count)
  const dailyOrders: DateCountRevenue[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count,
           COALESCE(SUM("totalPrice"), 0) as revenue
    FROM "Order"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;

  const buckets = generateDailyBuckets(start, end);
  const orderMap = buildDateMap(dailyOrders);
  const salesTrend = buckets.map((d) => ({
    date: d,
    orders: Number(orderMap.get(d)?.count ?? 0),
    revenue: Number(orderMap.get(d)?.revenue ?? 0),
  }));

  // Top categories by revenue
  const topCategories: CategoryRevenue[] = await prisma.$queryRaw`
    SELECT p."category", SUM(oi."price" * oi."quantity") as revenue, COUNT(*)::bigint as count
    FROM "OrderItem" oi
    JOIN "Product" p ON p."id" = oi."productId"
    JOIN "Order" o ON o."id" = oi."orderId"
    WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
    GROUP BY p."category"
    ORDER BY revenue DESC
    LIMIT 10
  `;

  // Top selling books
  const topBooks: BookRow[] = await prisma.$queryRaw`
    SELECT p."name", p."author", SUM(oi."quantity")::bigint as quantity,
           SUM(oi."price" * oi."quantity") as revenue
    FROM "OrderItem" oi
    JOIN "Product" p ON p."id" = oi."productId"
    JOIN "Order" o ON o."id" = oi."orderId"
    WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
    GROUP BY p."id", p."name", p."author"
    ORDER BY quantity DESC
    LIMIT 10
  `;

  // Rating distribution
  const ratingDistribution: RatingRow[] = await prisma.$queryRaw`
    SELECT "rating", COUNT(*)::bigint as count
    FROM "Review"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY "rating"
    ORDER BY "rating"
  `;

  // Reviews trend
  const dailyReviews: DateCount[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
    FROM "Review"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;
  const reviewMap = buildDateMap(dailyReviews);
  const reviewsTrend = buckets.map((d) => ({
    date: d,
    reviews: Number(reviewMap.get(d)?.count ?? 0),
  }));

  return {
    salesTrend,
    topCategories: topCategories.map((c) => ({
      category: c.category,
      revenue: Number(c.revenue),
      count: Number(c.count),
    })),
    topBooks: topBooks.map((b) => ({
      name: b.name,
      author: b.author,
      quantity: Number(b.quantity),
      revenue: Number(b.revenue),
    })),
    ratingDistribution: ratingDistribution.map((r) => ({
      rating: r.rating,
      count: Number(r.count),
    })),
    reviewsTrend,
  };
}

// ── Community Engagement ─────────────────────────────

export async function getCommunityEngagement(
  period: string,
  customStart?: string,
  customEnd?: string,
) {
  const { start, end } = dateRange(period, customStart, customEnd);

  // Reviews over time
  const dailyReviews: DateCount[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
    FROM "Review"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;

  const buckets = generateDailyBuckets(start, end);
  const reviewMap = buildDateMap(dailyReviews);
  const reviewsTrend = buckets.map((d) => ({
    date: d,
    reviews: Number(reviewMap.get(d)?.count ?? 0),
  }));

  // Follow activity
  const dailyFollows: DateCount[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
    FROM "UserFollow"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;
  const followMap = buildDateMap(dailyFollows);
  const followsTrend = buckets.map((d) => ({
    date: d,
    follows: Number(followMap.get(d)?.count ?? 0),
  }));

  // Top reviewers
  const topReviewers: TopReviewerRow[] = await prisma.$queryRaw`
    SELECT u."name", COUNT(*)::bigint as review_count, AVG(r."rating")::float as avg_rating
    FROM "Review" r
    JOIN "User" u ON u."id" = r."userId"
    WHERE r."createdAt" >= ${start} AND r."createdAt" <= ${end}
    GROUP BY u."id", u."name"
    ORDER BY review_count DESC
    LIMIT 10
  `;

  // Vote activity (helpful/not-helpful)
  const voteStats: VoteRow[] = await prisma.$queryRaw`
    SELECT "isHelpful" as is_helpful, COUNT(*)::bigint as count
    FROM "ReviewVote"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY "isHelpful"
  `;

  // Review reports
  const reportCount = await prisma.reviewReport.count({
    where: { createdAt: { gte: start, lte: end } },
  });

  // Book submissions
  const submissionsByStatus: StatusCount[] = await prisma.$queryRaw`
    SELECT "status"::text, COUNT(*)::bigint as count
    FROM "BookSubmission"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY "status"
  `;

  return {
    reviewsTrend,
    followsTrend,
    topReviewers: topReviewers.map((r) => ({
      name: r.name,
      reviewCount: Number(r.review_count),
      avgRating: Math.round(r.avg_rating * 100) / 100,
    })),
    voteStats: voteStats.map((v) => ({
      label: v.is_helpful ? 'Helpful' : 'Not Helpful',
      count: Number(v.count),
    })),
    reportCount,
    submissionsByStatus: submissionsByStatus.map((s) => ({
      status: s.status,
      count: Number(s.count),
    })),
  };
}

// ── Events & Clubs ───────────────────────────────────

export async function getEventsClubsAnalytics(
  period: string,
  customStart?: string,
  customEnd?: string,
) {
  const { start, end } = dateRange(period, customStart, customEnd);

  // Club requests over time
  const clubRequests: ClubRequestRow[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count, "type"::text
    FROM "ClubRequest"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt"), "type"
    ORDER BY date
  `;

  // Requests by status
  const requestsByStatus: StatusCount[] = await prisma.$queryRaw`
    SELECT "status"::text, COUNT(*)::bigint as count
    FROM "ClubRequest"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY "status"
  `;

  // Active clubs/events count
  const activeClubs = await prisma.readingClub.count({
    where: { isActive: true },
  });
  const activeEvents = await prisma.event.count({ where: { isActive: true } });

  // Registration trend
  const dailyRegistrations: DateCount[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
    FROM "Registration"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;
  const buckets = generateDailyBuckets(start, end);
  const regMap = buildDateMap(dailyRegistrations);
  const registrationsTrend = buckets.map((d) => ({
    date: d,
    registrations: Number(regMap.get(d)?.count ?? 0),
  }));

  // Format distribution
  const formatDistribution: FormatCount[] = await prisma.$queryRaw`
    SELECT "format"::text, COUNT(*)::bigint as count
    FROM "ClubRequest"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY "format"
  `;

  // Attendance stats
  const attendanceStats: StatusCount[] = await prisma.$queryRaw`
    SELECT "status"::text, COUNT(*)::bigint as count
    FROM "Attendance"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY "status"
  `;

  // Top clubs by members
  const topClubs: TopClubRow[] = await prisma.$queryRaw`
    SELECT "title", array_length("memberIds", 1) as member_count
    FROM "ReadingClub"
    WHERE "isActive" = true
    ORDER BY member_count DESC NULLS LAST
    LIMIT 10
  `;

  return {
    clubRequests: clubRequests.map((r) => ({
      date: r.date.toString().slice(0, 10),
      count: Number(r.count),
      type: r.type,
    })),
    requestsByStatus: requestsByStatus.map((s) => ({
      status: s.status,
      count: Number(s.count),
    })),
    activeClubs,
    activeEvents,
    registrationsTrend,
    formatDistribution: formatDistribution.map((f) => ({
      format: f.format,
      count: Number(f.count),
    })),
    attendanceStats: attendanceStats.map((a) => ({
      status: a.status,
      count: Number(a.count),
    })),
    topClubs: topClubs.map((c) => ({
      title: c.title,
      memberCount: c.member_count ?? 0,
    })),
  };
}

// ── User Behavior ────────────────────────────────────

export async function getUserBehavior(
  period: string,
  customStart?: string,
  customEnd?: string,
) {
  const { start, end } = dateRange(period, customStart, customEnd);

  // New user signups trend
  const dailySignups: DateCount[] = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
    FROM "User"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;
  const buckets = generateDailyBuckets(start, end);
  const signupMap = buildDateMap(dailySignups);
  const signupsTrend = buckets.map((d) => ({
    date: d,
    signups: Number(signupMap.get(d)?.count ?? 0),
  }));

  // User role distribution
  const roleDistribution: RoleRow[] = await prisma.$queryRaw`
    SELECT "role", COUNT(*)::bigint as count
    FROM "User"
    GROUP BY "role"
  `;

  // Purchasing patterns: orders per user (top buyers)
  const topBuyers: TopBuyerRow[] = await prisma.$queryRaw`
    SELECT u."name", COUNT(o."id")::bigint as order_count, SUM(o."totalPrice") as total_spent
    FROM "Order" o
    JOIN "User" u ON u."id" = o."userId"
    WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
    GROUP BY u."id", u."name"
    ORDER BY total_spent DESC
    LIMIT 10
  `;

  // Activity heatmap: orders by day-of-week and hour
  const activityHeatmap: HeatmapRow[] = await prisma.$queryRaw`
    SELECT EXTRACT(DOW FROM "createdAt")::int as day_of_week,
           EXTRACT(HOUR FROM "createdAt")::int as hour,
           COUNT(*)::bigint as count
    FROM "Order"
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY day_of_week, hour
    ORDER BY day_of_week, hour
  `;

  // Cart abandonment (carts without orders)
  const totalCarts = await prisma.cart.count({
    where: { createdAt: { gte: start, lte: end } },
  });
  const totalOrders = await prisma.order.count({
    where: { createdAt: { gte: start, lte: end } },
  });

  // Repeat vs one-time buyers
  const repeatBuyers: CountOnly[] = await prisma.$queryRaw`
    SELECT COUNT(*)::bigint as count FROM (
      SELECT "userId" FROM "Order"
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY "userId" HAVING COUNT(*) > 1
    ) sub
  `;
  const oneTimeBuyers: CountOnly[] = await prisma.$queryRaw`
    SELECT COUNT(*)::bigint as count FROM (
      SELECT "userId" FROM "Order"
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY "userId" HAVING COUNT(*) = 1
    ) sub
  `;

  return {
    signupsTrend,
    roleDistribution: roleDistribution.map((r) => ({
      role: r.role,
      count: Number(r.count),
    })),
    topBuyers: topBuyers.map((b) => ({
      name: b.name,
      orderCount: Number(b.order_count),
      totalSpent: Number(b.total_spent),
    })),
    activityHeatmap: activityHeatmap.map((a) => ({
      dayOfWeek: a.day_of_week,
      hour: a.hour,
      count: Number(a.count),
    })),
    cartAbandonment: {
      totalCarts,
      totalOrders,
      abandonmentRate:
        totalCarts > 0
          ? Math.round(((totalCarts - totalOrders) / totalCarts) * 100)
          : 0,
    },
    buyerTypes: {
      repeat: Number(repeatBuyers[0]?.count ?? 0),
      oneTime: Number(oneTimeBuyers[0]?.count ?? 0),
    },
  };
}

// ── Report CRUD ──────────────────────────────────────

export async function generateAnalyticsReport(input: {
  category:
    | 'reading_trends'
    | 'community_engagement'
    | 'events_clubs'
    | 'user_behavior';
  period: string;
  customStart?: string;
  customEnd?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error('User is not authorized');
  }

  const { start, end } = dateRange(
    input.period,
    input.customStart,
    input.customEnd,
  );

  // Create pending report
  const report = await prisma.analyticsReport.create({
    data: {
      category: input.category,
      title: `${input.category.replace(/_/g, ' ')} report`,
      period: input.period,
      startDate: start,
      endDate: end,
      data: {},
      status: 'processing',
      progress: 10,
      createdBy: session.user.id!,
    },
  });

  try {
    // Update progress
    await prisma.analyticsReport.update({
      where: { id: report.id },
      data: { progress: 30 },
    });

    let data: unknown;

    switch (input.category) {
      case 'reading_trends':
        data = await getReadingTrends(
          input.period,
          input.customStart,
          input.customEnd,
        );
        break;
      case 'community_engagement':
        data = await getCommunityEngagement(
          input.period,
          input.customStart,
          input.customEnd,
        );
        break;
      case 'events_clubs':
        data = await getEventsClubsAnalytics(
          input.period,
          input.customStart,
          input.customEnd,
        );
        break;
      case 'user_behavior':
        data = await getUserBehavior(
          input.period,
          input.customStart,
          input.customEnd,
        );
        break;
    }

    await prisma.analyticsReport.update({
      where: { id: report.id },
      data: { progress: 90 },
    });

    // Store completed report
    const completed = await prisma.analyticsReport.update({
      where: { id: report.id },
      data: {
        data: data as Prisma.InputJsonValue,
        status: 'completed',
        progress: 100,
      },
    });

    return { success: true, report: JSON.parse(JSON.stringify(completed)) };
  } catch (error) {
    await prisma.analyticsReport.update({
      where: { id: report.id },
      data: { status: 'failed', progress: 0 },
    });
    throw error;
  }
}

export async function getAnalyticsReports(page = 1, limit = 10) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error('User is not authorized');
  }

  const [reports, total] = await Promise.all([
    prisma.analyticsReport.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { name: true } } },
    }),
    prisma.analyticsReport.count(),
  ]);

  return {
    reports: JSON.parse(JSON.stringify(reports)),
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAnalyticsReport(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error('User is not authorized');
  }

  const report = await prisma.analyticsReport.findUnique({ where: { id } });
  if (!report) throw new Error('Report not found');

  return JSON.parse(JSON.stringify(report));
}

export async function getReportProgress(id: string) {
  const report = await prisma.analyticsReport.findUnique({
    where: { id },
    select: { id: true, status: true, progress: true },
  });
  return report ? JSON.parse(JSON.stringify(report)) : null;
}

export async function deleteAnalyticsReport(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error('User is not authorized');
  }

  await prisma.analyticsReport.delete({ where: { id } });
  return { success: true };
}
