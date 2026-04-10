'use client';

import { useState, useTransition, useCallback, lazy, Suspense } from 'react';
import CommunityStatsBar from '@/components/community/community-stats-bar';
import TrendingBooksGrid from '@/components/community/trending-books-grid';
import ActiveClubsList from '@/components/community/active-clubs-list';
import UpcomingEventsCalendar from '@/components/community/upcoming-events-calendar';
import GenreCloud from '@/components/community/genre-cloud';
import TopBooksRanking from '@/components/community/top-books-ranking';
import ActivityFeed from '@/components/community/activity-feed';
import ActivityTicker from '@/components/community/activity-ticker';
import PeriodFilter, {
  type Period,
} from '@/components/community/period-filter';

const ReadingTrendsChart = lazy(
  () => import('@/components/community/reading-trends-chart'),
);

/* ─── types ─── */
interface FeedItemServer {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface CommunityData {
  stats: {
    totalBooks: number;
    totalMembers: number;
    activeClubs: number;
    upcomingEvents: number;
    totalReviews: number;
    totalOrders: number;
  };
  trending: {
    id: string;
    name: string;
    slug: string;
    author: string;
    category: string;
    image: string;
    price: number;
    rating: number;
    numReviews: number;
    totalSold: number;
    recentReviews: number;
  }[];
  clubs: {
    id: string;
    title: string;
    purpose: string;
    description: string;
    memberCount: number;
    capacity: number;
    format: string;
    startDate: string;
    bookCount: number;
    creatorName: string;
    activeRegistrations: number;
  }[];
  events: {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    capacity: number;
    format: string;
    attendeeCount: number;
    organizerName: string;
    bookCount: number;
  }[];
  genres: {
    genre: string;
    bookCount: number;
    revenue: number;
  }[];
  feed: FeedItemServer[];
  topBooks: {
    rank: number;
    id: string;
    name: string;
    slug: string;
    author: string;
    image: string;
    price: number;
    rating: number;
    totalSold: number;
  }[];
  trends: {
    purchases: { date: string; count: number }[];
    reviews: { date: string; count: number }[];
  };
}

/* ─── helpers ─── */
function mapFeedItems(items: FeedItemServer[]) {
  return items.map((item) => ({
    type: item.type as 'review' | 'registration' | 'purchase',
    title: item.message.split('"')[1] ?? item.message.slice(0, 40),
    description: item.message,
    createdAt: item.timestamp,
  }));
}

/* spinner */
function SectionSpinner() {
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary' />
    </div>
  );
}

/* ─── Dashboard ─── */
export default function CommunityDashboardClient({
  initialData,
}: {
  initialData: CommunityData;
}) {
  const [data, setData] = useState(initialData);
  const [period, setPeriod] = useState<Period>('month');
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = useCallback((p: Period) => {
    setPeriod(p);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/community?section=all&period=${p}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch {
        // Silently keep current data on failure
      }
    });
  }, []);

  const feedItems = mapFeedItems(data.feed ?? []);

  return (
    <div className='space-y-6 py-4'>
      {/* ── Header ── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Community Dashboard
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Discover what our community is reading, discussing, and exploring.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <PeriodFilter value={period} onChange={handlePeriodChange} />
          {isPending && (
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-primary' />
          )}
        </div>
      </div>

      {/* ── Activity Ticker ── */}
      <ActivityTicker data={feedItems.slice(0, 10)} />

      {/* ── Stats Bar ── */}
      <CommunityStatsBar data={data.stats} />

      {/* ── Main Grid: Trending + Activity Feed ── */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <TrendingBooksGrid books={data.trending} />
        </div>
        <div>
          <ActivityFeed data={feedItems} />
        </div>
      </div>

      {/* ── Reading Trends Chart ── */}
      <Suspense fallback={<SectionSpinner />}>
        <ReadingTrendsChart data={data.trends} />
      </Suspense>

      {/* ── Genre Cloud + Top Books side-by-side ── */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <GenreCloud genres={data.genres} />
        <TopBooksRanking books={data.topBooks} period={period} />
      </div>

      {/* ── Active Clubs ── */}
      <ActiveClubsList clubs={data.clubs} />

      {/* ── Upcoming Events ── */}
      <UpcomingEventsCalendar events={data.events} />
    </div>
  );
}
