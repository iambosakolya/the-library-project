'use server';

import { prisma } from '@/db/prisma';
import { auth } from '@/auth';
import { convertToPlainObj } from '@/lib/utils';
import type { AchievementType } from '@/src/generated/prisma';

// ── In-memory cache layer ──

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

const TWO_MIN = 2 * 60 * 1000;

// ── Auth helper ──

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

// ── Types ──

export type TimelineItem = {
  date: string;
  reviews: number;
  purchases: number;
  events: number;
  clubs: number;
};

export type GenrePreference = {
  genre: string;
  count: number;
  percentage: number;
};

export type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  totalHelpfulVotes: number;
  totalReplies: number;
  reviewsByMonth: { month: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
};

export type ParticipationItem = {
  id: string;
  title: string;
  type: 'club' | 'event';
  role: 'member' | 'organizer';
  startDate: Date;
  isActive: boolean;
  attendanceRate: number;
};

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  streakStartDate: Date | null;
};

export type InteractionUser = {
  id: string;
  name: string;
  image: string | null;
  interactions: number;
  type: 'review_reply' | 'club_member' | 'follower';
};

export type YearInBooks = {
  year: number;
  totalPurchased: number;
  totalReviewed: number;
  totalSpent: number;
  favoriteGenre: string;
  averageRating: number;
  clubsJoined: number;
  eventsAttended: number;
  topBooks: { name: string; slug: string; rating: number }[];
  monthlyActivity: { month: string; purchases: number; reviews: number }[];
};

export type GoalData = {
  id: string;
  type: string;
  target: number;
  current: number;
  year: number;
  isActive: boolean;
  percentage: number;
};

export type AchievementData = {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
};

export type PrivacySettings = {
  profileVisibility: string;
  goalsVisibility: string;
  streakVisibility: string;
  reviewsVisibility: string;
  activityVisibility: string;
};

export type DashboardData = {
  timeline: TimelineItem[];
  genrePreferences: GenrePreference[];
  reviewStats: ReviewStats;
  participation: ParticipationItem[];
  streak: StreakData;
  interactionNetwork: InteractionUser[];
  yearInBooks: YearInBooks;
  goals: GoalData[];
  achievements: AchievementData[];
  privacySettings: PrivacySettings;
};

// ── 1. Reading Activity Timeline ──

export async function getReadingTimeline(
  period: string = 'year',
): Promise<TimelineItem[]> {
  const userId = await requireUserId();
  return cached(`timeline:${userId}:${period}`, TWO_MIN, async () => {
    const months = period === 'year' ? 12 : period === 'month' ? 1 : 6;
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    // Reviews by month
    const reviews = await prisma.review.groupBy({
      by: ['createdAt'],
      where: { userId, createdAt: { gte: since } },
      _count: true,
    });

    // Purchases by month
    const orders = await prisma.order.findMany({
      where: { userId, isPaid: true, createdAt: { gte: since } },
      include: { orderitems: true },
      orderBy: { createdAt: 'asc' },
    });

    // Registrations (clubs + events)
    const registrations = await prisma.registration.findMany({
      where: { userId, registeredAt: { gte: since }, status: 'active' },
      include: { club: true, event: true },
    });

    // Build monthly buckets
    const buckets = new Map<
      string,
      { reviews: number; purchases: number; events: number; clubs: number }
    >();

    for (let i = 0; i <= months; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (months - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, { reviews: 0, purchases: 0, events: 0, clubs: 0 });
    }

    reviews.forEach((r) => {
      const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const b = buckets.get(key);
      if (b) b.reviews += r._count;
    });

    orders.forEach((o) => {
      const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const b = buckets.get(key);
      if (b) b.purchases += o.orderitems.length;
    });

    registrations.forEach((reg) => {
      const date = reg.registeredAt;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const b = buckets.get(key);
      if (b) {
        if (reg.clubId) b.clubs++;
        if (reg.eventId) b.events++;
      }
    });

    return Array.from(buckets.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  });
}

// ── 2. Genre Preference Wheel ──

export async function getGenrePreferences(): Promise<GenrePreference[]> {
  const userId = await requireUserId();
  return cached(`genres:${userId}`, TWO_MIN, async () => {
    // From purchases
    const purchasedItems = await prisma.orderItem.findMany({
      where: { order: { userId, isPaid: true } },
      include: { product: { select: { category: true } } },
    });

    // From reviews
    const reviewedItems = await prisma.review.findMany({
      where: { userId },
      include: { product: { select: { category: true } } },
    });

    const genreCounts = new Map<string, number>();

    purchasedItems.forEach((item) => {
      const genre = item.product.category;
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 2); // purchases weight more
    });

    reviewedItems.forEach((item) => {
      const genre = item.product.category;
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    });

    const total = Array.from(genreCounts.values()).reduce((a, b) => a + b, 0);

    return Array.from(genreCounts.entries())
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  });
}

// ── 3. Review Writing Statistics ──

export async function getReviewStats(): Promise<ReviewStats> {
  const userId = await requireUserId();
  return cached(`reviewStats:${userId}`, TWO_MIN, async () => {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        votes: true,
        replies: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
    const totalHelpfulVotes = reviews.reduce(
      (sum, r) => sum + r.votes.filter((v) => v.isHelpful).length,
      0,
    );
    const totalReplies = reviews.reduce((sum, r) => sum + r.replies.length, 0);

    // Reviews by month (last 12 months)
    const monthMap = new Map<string, number>();
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, 0);
    }
    reviews.forEach((r) => {
      const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(key)) {
        monthMap.set(key, (monthMap.get(key) || 0) + 1);
      }
    });

    // Rating distribution
    const ratingDist = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: reviews.filter((r) => r.rating === rating).length,
    }));

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalHelpfulVotes,
      totalReplies,
      reviewsByMonth: Array.from(monthMap.entries()).map(([month, count]) => ({
        month,
        count,
      })),
      ratingDistribution: ratingDist,
    };
  });
}

// ── 4. Club/Event Participation History ──

export async function getParticipationHistory(): Promise<ParticipationItem[]> {
  const userId = await requireUserId();
  return cached(`participation:${userId}`, TWO_MIN, async () => {
    // Clubs the user created
    const createdClubs = await prisma.readingClub.findMany({
      where: { creatorId: userId },
      include: {
        attendances: { where: { userId } },
      },
    });

    // Registrations
    const registrations = await prisma.registration.findMany({
      where: { userId, status: 'active' },
      include: {
        club: {
          include: {
            attendances: { where: { userId } },
          },
        },
        event: {
          include: {
            attendances: { where: { userId } },
          },
        },
      },
    });

    const items: ParticipationItem[] = [];

    createdClubs.forEach((club) => {
      const totalSessions = club.sessionCount;
      const attended = club.attendances.filter(
        (a) => a.status === 'present',
      ).length;
      items.push({
        id: club.id,
        title: club.title,
        type: 'club',
        role: 'organizer',
        startDate: club.startDate,
        isActive: club.isActive,
        attendanceRate:
          totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0,
      });
    });

    registrations.forEach((reg) => {
      if (reg.club && !items.find((i) => i.id === reg.club!.id)) {
        const totalSessions = reg.club.sessionCount;
        const attended = reg.club.attendances.filter(
          (a) => a.status === 'present',
        ).length;
        items.push({
          id: reg.club.id,
          title: reg.club.title,
          type: 'club',
          role: 'member',
          startDate: reg.club.startDate,
          isActive: reg.club.isActive,
          attendanceRate:
            totalSessions > 0
              ? Math.round((attended / totalSessions) * 100)
              : 0,
        });
      }
      if (reg.event) {
        const attended = reg.event.attendances.filter(
          (a) => a.status === 'present',
        ).length;
        items.push({
          id: reg.event.id,
          title: reg.event.title,
          type: 'event',
          role: reg.event.organizerId === userId ? 'organizer' : 'member',
          startDate: reg.event.eventDate,
          isActive: reg.event.isActive,
          attendanceRate: attended > 0 ? 100 : 0,
        });
      }
    });

    return convertToPlainObj(
      items.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
    );
  });
}

// ── 5. Reading Streak Tracker ──

export async function getReadingStreak(): Promise<StreakData> {
  const userId = await requireUserId();
  return cached(`streak:${userId}`, TWO_MIN, async () => {
    let streak = await prisma.readingStreak.findUnique({ where: { userId } });

    if (!streak) {
      streak = await prisma.readingStreak.create({
        data: { userId, currentStreak: 0, longestStreak: 0 },
      });
    }

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      streakStartDate: streak.streakStartDate,
    };
  });
}

export async function updateReadingStreak(): Promise<StreakData> {
  const userId = await requireUserId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await prisma.readingStreak.findUnique({ where: { userId } });

  if (!streak) {
    streak = await prisma.readingStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        streakStartDate: today,
      },
    });
  } else {
    const lastDate = streak.lastActivityDate
      ? new Date(streak.lastActivityDate)
      : null;
    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
    }

    const diffDays = lastDate
      ? Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : -1;

    if (diffDays === 0) {
      // Already logged today
      return {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        streakStartDate: streak.streakStartDate,
      };
    }

    let newCurrent: number;
    let newStart: Date;

    if (diffDays === 1) {
      // Consecutive day
      newCurrent = streak.currentStreak + 1;
      newStart = streak.streakStartDate || today;
    } else {
      // Streak broken
      newCurrent = 1;
      newStart = today;
    }

    const newLongest = Math.max(streak.longestStreak, newCurrent);

    streak = await prisma.readingStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrent,
        longestStreak: newLongest,
        lastActivityDate: today,
        streakStartDate: newStart,
      },
    });
  }

  // Invalidate cache
  cache.delete(`streak:${userId}`);

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastActivityDate: streak.lastActivityDate,
    streakStartDate: streak.streakStartDate,
  };
}

// ── 6. Interaction Network ──

export async function getInteractionNetwork(): Promise<InteractionUser[]> {
  const userId = await requireUserId();
  return cached(`interactions:${userId}`, TWO_MIN, async () => {
    const interactions = new Map<
      string,
      { name: string; image: string | null; count: number; type: string }
    >();

    // People who replied to your reviews
    const repliesOnMyReviews = await prisma.reviewReply.findMany({
      where: { review: { userId }, NOT: { userId } },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    repliesOnMyReviews.forEach((reply) => {
      const existing = interactions.get(reply.userId);
      if (existing) {
        existing.count++;
      } else {
        interactions.set(reply.userId, {
          name: reply.user.name,
          image: reply.user.image,
          count: 1,
          type: 'review_reply',
        });
      }
    });

    // People you replied to
    const myReplies = await prisma.reviewReply.findMany({
      where: { userId },
      include: {
        review: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    myReplies.forEach((reply) => {
      if (reply.review.userId === userId) return;
      const existing = interactions.get(reply.review.userId);
      if (existing) {
        existing.count++;
      } else {
        interactions.set(reply.review.userId, {
          name: reply.review.user.name,
          image: reply.review.user.image,
          count: 1,
          type: 'review_reply',
        });
      }
    });

    // Club co-members
    const myClubs = await prisma.readingClub.findMany({
      where: {
        OR: [{ creatorId: userId }, { memberIds: { has: userId } }],
      },
    });

    for (const club of myClubs) {
      const allMemberIds = [club.creatorId, ...club.memberIds].filter(
        (id) => id !== userId,
      );
      const members = await prisma.user.findMany({
        where: { id: { in: allMemberIds } },
        select: { id: true, name: true, image: true },
      });
      members.forEach((m) => {
        const existing = interactions.get(m.id);
        if (existing) {
          existing.count++;
        } else {
          interactions.set(m.id, {
            name: m.name,
            image: m.image,
            count: 1,
            type: 'club_member',
          });
        }
      });
    }

    // Followers / Following
    const follows = await prisma.userFollow.findMany({
      where: { OR: [{ followerId: userId }, { followingId: userId }] },
      include: {
        follower: { select: { id: true, name: true, image: true } },
        following: { select: { id: true, name: true, image: true } },
      },
    });

    follows.forEach((f) => {
      const otherId = f.followerId === userId ? f.followingId : f.followerId;
      const other = f.followerId === userId ? f.following : f.follower;
      const existing = interactions.get(otherId);
      if (existing) {
        existing.count++;
      } else {
        interactions.set(otherId, {
          name: other.name,
          image: other.image,
          count: 1,
          type: 'follower',
        });
      }
    });

    return Array.from(interactions.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        image: data.image,
        interactions: data.count,
        type: data.type as InteractionUser['type'],
      }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 20);
  });
}

// ── 7. Year in Books Summary ──

export async function getYearInBooks(year?: number): Promise<YearInBooks> {
  const userId = await requireUserId();
  const targetYear = year || new Date().getFullYear();
  return cached(`yearInBooks:${userId}:${targetYear}`, TWO_MIN, async () => {
    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);

    // Orders
    const orders = await prisma.order.findMany({
      where: {
        userId,
        isPaid: true,
        createdAt: { gte: startOfYear, lte: endOfYear },
      },
      include: {
        orderitems: {
          include: {
            product: { select: { name: true, slug: true, category: true } },
          },
        },
      },
    });

    const totalPurchased = orders.reduce(
      (sum, o) => sum + o.orderitems.length,
      0,
    );
    const totalSpent = orders.reduce(
      (sum, o) => sum + parseFloat(String(o.totalPrice)),
      0,
    );

    // Reviews
    const reviews = await prisma.review.findMany({
      where: {
        userId,
        createdAt: { gte: startOfYear, lte: endOfYear },
      },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });

    const totalReviewed = reviews.length;
    const averageRating =
      totalReviewed > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewed
        : 0;

    // Genre counting
    const genreCounts = new Map<string, number>();
    orders.forEach((o) =>
      o.orderitems.forEach((item) => {
        const cat = item.product.category;
        genreCounts.set(cat, (genreCounts.get(cat) || 0) + 1);
      }),
    );
    const favoriteGenre =
      Array.from(genreCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'N/A';

    // Club registrations
    const clubRegs = await prisma.registration.count({
      where: {
        userId,
        clubId: { not: null },
        registeredAt: { gte: startOfYear, lte: endOfYear },
      },
    });

    // Event registrations
    const eventRegs = await prisma.registration.count({
      where: {
        userId,
        eventId: { not: null },
        registeredAt: { gte: startOfYear, lte: endOfYear },
      },
    });

    // Top rated books
    const topBooks = reviews
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map((r) => ({
        name: r.product.name,
        slug: r.product.slug,
        rating: r.rating,
      }));

    // Monthly activity
    const monthlyActivity: YearInBooks['monthlyActivity'] = [];
    for (let m = 0; m < 12; m++) {
      const monthKey = `${targetYear}-${String(m + 1).padStart(2, '0')}`;
      const monthPurchases = orders.filter(
        (o) => o.createdAt.getMonth() === m,
      ).length;
      const monthReviews = reviews.filter(
        (r) => r.createdAt.getMonth() === m,
      ).length;
      monthlyActivity.push({
        month: monthKey,
        purchases: monthPurchases,
        reviews: monthReviews,
      });
    }

    return {
      year: targetYear,
      totalPurchased,
      totalReviewed,
      totalSpent: Math.round(totalSpent * 100) / 100,
      favoriteGenre,
      averageRating: Math.round(averageRating * 10) / 10,
      clubsJoined: clubRegs,
      eventsAttended: eventRegs,
      topBooks,
      monthlyActivity,
    };
  });
}

// ── 8. Goals CRUD ──

export async function getGoals(): Promise<GoalData[]> {
  const userId = await requireUserId();
  const currentYear = new Date().getFullYear();

  const goals = await prisma.readingGoal.findMany({
    where: { userId, year: currentYear },
    orderBy: { type: 'asc' },
  });

  // Compute current progress
  const startOfYear = new Date(currentYear, 0, 1);
  const now = new Date();

  const [reviewCount, eventCount, purchaseCount] = await Promise.all([
    prisma.review.count({
      where: { userId, createdAt: { gte: startOfYear, lte: now } },
    }),
    prisma.registration.count({
      where: {
        userId,
        eventId: { not: null },
        status: 'active',
        registeredAt: { gte: startOfYear, lte: now },
      },
    }),
    prisma.orderItem.count({
      where: {
        order: {
          userId,
          isPaid: true,
          createdAt: { gte: startOfYear, lte: now },
        },
      },
    }),
  ]);

  return goals.map((goal) => {
    let current = 0;
    switch (goal.type) {
      case 'books_to_read':
        current = purchaseCount;
        break;
      case 'reviews_to_write':
        current = reviewCount;
        break;
      case 'events_to_attend':
        current = eventCount;
        break;
    }
    return {
      id: goal.id,
      type: goal.type,
      target: goal.target,
      current,
      year: goal.year,
      isActive: goal.isActive,
      percentage:
        goal.target > 0
          ? Math.min(100, Math.round((current / goal.target) * 100))
          : 0,
    };
  });
}

export async function upsertGoal(
  type: 'books_to_read' | 'reviews_to_write' | 'events_to_attend',
  target: number,
): Promise<GoalData> {
  const userId = await requireUserId();
  const year = new Date().getFullYear();

  const goal = await prisma.readingGoal.upsert({
    where: { userId_type_year: { userId, type, year } },
    update: { target, isActive: true },
    create: { userId, type, target, year },
  });

  cache.delete(`goals:${userId}`);

  return {
    id: goal.id,
    type: goal.type,
    target: goal.target,
    current: 0,
    year: goal.year,
    isActive: goal.isActive,
    percentage: 0,
  };
}

export async function deleteGoal(
  goalId: string,
): Promise<{ success: boolean }> {
  const userId = await requireUserId();
  await prisma.readingGoal.deleteMany({
    where: { id: goalId, userId },
  });
  cache.delete(`goals:${userId}`);
  return { success: true };
}

// ── 9. Achievements ──

export async function getAchievements(): Promise<AchievementData[]> {
  const userId = await requireUserId();
  return cached(`achievements:${userId}`, TWO_MIN, async () => {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });
    return convertToPlainObj(achievements);
  });
}

export async function checkAndAwardAchievements(): Promise<AchievementData[]> {
  const userId = await requireUserId();
  const now = new Date();

  const [reviewCount, clubCount, eventCount, streak, genreCount, followCount] =
    await Promise.all([
      prisma.review.count({ where: { userId } }),
      prisma.registration.count({
        where: { userId, clubId: { not: null }, status: 'active' },
      }),
      prisma.registration.count({
        where: { userId, eventId: { not: null }, status: 'active' },
      }),
      prisma.readingStreak.findUnique({ where: { userId } }),
      prisma.review
        .findMany({
          where: { userId },
          include: { product: { select: { category: true } } },
        })
        .then(
          (reviews) => new Set(reviews.map((r) => r.product.category)).size,
        ),
      prisma.userFollow.count({
        where: { OR: [{ followerId: userId }, { followingId: userId }] },
      }),
    ]);

  type AchievementDef = {
    type: string;
    title: string;
    description: string;
    icon: string;
    condition: boolean;
  };

  const achievementDefs: AchievementDef[] = [
    {
      type: 'first_review',
      title: 'First Words',
      description: 'Wrote your first review',
      icon: 'pen-tool',
      condition: reviewCount >= 1,
    },
    {
      type: 'five_reviews',
      title: 'Critic in Training',
      description: 'Wrote 5 reviews',
      icon: 'file-text',
      condition: reviewCount >= 5,
    },
    {
      type: 'ten_reviews',
      title: 'Seasoned Reviewer',
      description: 'Wrote 10 reviews',
      icon: 'trophy',
      condition: reviewCount >= 10,
    },
    {
      type: 'twenty_five_reviews',
      title: 'Review Master',
      description: 'Wrote 25 reviews',
      icon: 'star',
      condition: reviewCount >= 25,
    },
    {
      type: 'fifty_reviews',
      title: 'Literary Sage',
      description: 'Wrote 50 reviews',
      icon: 'crown',
      condition: reviewCount >= 50,
    },
    {
      type: 'first_club',
      title: 'Club Member',
      description: 'Joined your first reading club',
      icon: 'book-open',
      condition: clubCount >= 1,
    },
    {
      type: 'five_clubs',
      title: 'Social Reader',
      description: 'Joined 5 reading clubs',
      icon: 'handshake',
      condition: clubCount >= 5,
    },
    {
      type: 'first_event',
      title: 'Event Goer',
      description: 'Attended your first event',
      icon: 'party-popper',
      condition: eventCount >= 1,
    },
    {
      type: 'five_events',
      title: 'Regular Attendee',
      description: 'Attended 5 events',
      icon: 'tent',
      condition: eventCount >= 5,
    },
    {
      type: 'ten_events',
      title: 'Event Enthusiast',
      description: 'Attended 10 events',
      icon: 'medal',
      condition: eventCount >= 10,
    },
    {
      type: 'streak_seven',
      title: 'Week Warrior',
      description: '7-day reading streak',
      icon: 'flame',
      condition: (streak?.currentStreak || 0) >= 7,
    },
    {
      type: 'streak_thirty',
      title: 'Monthly Devotion',
      description: '30-day reading streak',
      icon: 'dumbbell',
      condition: (streak?.longestStreak || 0) >= 30,
    },
    {
      type: 'streak_ninety',
      title: 'Quarter Champion',
      description: '90-day reading streak',
      icon: 'zap',
      condition: (streak?.longestStreak || 0) >= 90,
    },
    {
      type: 'streak_year',
      title: 'Year of Reading',
      description: '365-day reading streak',
      icon: 'target',
      condition: (streak?.longestStreak || 0) >= 365,
    },
    {
      type: 'genre_explorer',
      title: 'Genre Explorer',
      description: 'Reviewed books in 5+ genres',
      icon: 'map',
      condition: genreCount >= 5,
    },
    {
      type: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Connected with 10+ readers',
      icon: 'heart-handshake',
      condition: followCount >= 10,
    },
  ];

  const existing = await prisma.userAchievement.findMany({
    where: { userId },
    select: { type: true },
  });
  const existingTypes = new Set(existing.map((a) => a.type));
  const newAchievements: AchievementData[] = [];

  for (const def of achievementDefs) {
    if (def.condition && !existingTypes.has(def.type as AchievementType)) {
      const created = await prisma.userAchievement.create({
        data: {
          userId,
          type: def.type as AchievementType,
          title: def.title,
          description: def.description,
          icon: def.icon,
          earnedAt: now,
        },
      });
      newAchievements.push(convertToPlainObj(created));
    }
  }

  cache.delete(`achievements:${userId}`);

  return newAchievements;
}

// ── 10. Privacy Settings ──

export async function getPrivacySettings(): Promise<PrivacySettings> {
  const userId = await requireUserId();
  let prefs = await prisma.userAnalyticsPreference.findUnique({
    where: { userId },
  });

  if (!prefs) {
    prefs = await prisma.userAnalyticsPreference.create({
      data: { userId },
    });
  }

  return {
    profileVisibility: prefs.profileVisibility,
    goalsVisibility: prefs.goalsVisibility,
    streakVisibility: prefs.streakVisibility,
    reviewsVisibility: prefs.reviewsVisibility,
    activityVisibility: prefs.activityVisibility,
  };
}

export async function updatePrivacySettings(
  settings: Partial<PrivacySettings>,
): Promise<PrivacySettings> {
  const userId = await requireUserId();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  const validLevels = ['public', 'friends_only', 'private'];

  for (const [key, value] of Object.entries(settings)) {
    if (validLevels.includes(value as string)) {
      data[key] = value;
    }
  }

  const prefs = await prisma.userAnalyticsPreference.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });

  return {
    profileVisibility: prefs.profileVisibility,
    goalsVisibility: prefs.goalsVisibility,
    streakVisibility: prefs.streakVisibility,
    reviewsVisibility: prefs.reviewsVisibility,
    activityVisibility: prefs.activityVisibility,
  };
}

// ── 11. Dashboard Layout Preferences ──

export async function saveDashboardLayout(
  layout: Record<string, unknown>,
): Promise<{ success: boolean }> {
  const userId = await requireUserId();
  await prisma.userAnalyticsPreference.upsert({
    where: { userId },
    update: { dashboardLayout: layout },
    create: { userId, dashboardLayout: layout },
  });
  return { success: true };
}

export async function getDashboardLayout(): Promise<Record<
  string,
  unknown
> | null> {
  const userId = await requireUserId();
  const prefs = await prisma.userAnalyticsPreference.findUnique({
    where: { userId },
    select: { dashboardLayout: true },
  });
  return (prefs?.dashboardLayout as Record<string, unknown>) || null;
}

// ── 12. Export Personal Data ──

export async function exportPersonalData(): Promise<{
  user: Record<string, unknown>;
  reviews: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  goals: GoalData[];
  achievements: AchievementData[];
  streak: StreakData;
  participation: ParticipationItem[];
  genrePreferences: GenrePreference[];
  yearInBooks: YearInBooks;
}> {
  const userId = await requireUserId();

  const [
    user,
    reviews,
    orders,
    goals,
    achievements,
    streak,
    participation,
    genrePreferences,
    yearInBooks,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    }),
    prisma.review.findMany({
      where: { userId },
      include: { product: { select: { name: true, slug: true } } },
    }),
    prisma.order.findMany({
      where: { userId },
      include: { orderitems: true },
    }),
    getGoals(),
    getAchievements(),
    getReadingStreak(),
    getParticipationHistory(),
    getGenrePreferences(),
    getYearInBooks(),
  ]);

  return convertToPlainObj({
    user: user || {},
    reviews,
    orders,
    goals,
    achievements,
    streak,
    participation,
    genrePreferences,
    yearInBooks,
  });
}

// ── 13. Get All Dashboard Data ──

export async function getFullDashboardData(
  period: string = 'year',
): Promise<DashboardData> {
  const [
    timeline,
    genrePreferences,
    reviewStats,
    participation,
    streak,
    interactionNetwork,
    yearInBooks,
    goals,
    achievements,
    privacySettings,
  ] = await Promise.all([
    getReadingTimeline(period),
    getGenrePreferences(),
    getReviewStats(),
    getParticipationHistory(),
    getReadingStreak(),
    getInteractionNetwork(),
    getYearInBooks(),
    getGoals(),
    getAchievements(),
    getPrivacySettings(),
  ]);

  // Check for new achievements as side-effect
  checkAndAwardAchievements().catch(() => {});

  // Update streak as side-effect
  updateReadingStreak().catch(() => {});

  return {
    timeline,
    genrePreferences,
    reviewStats,
    participation,
    streak,
    interactionNetwork,
    yearInBooks,
    goals,
    achievements,
    privacySettings,
  };
}
