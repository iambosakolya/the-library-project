import { Suspense } from 'react';
import { Metadata } from 'next';
import CommunityDashboardClient from './community-dashboard-client';
import {
  getCommunityStats,
  getTrendingBooks,
  getActiveClubs,
  getUpcomingEvents,
  getGenrePopularity,
  getActivityFeed,
  getTopBooks,
  getReadingTrendsPublic,
} from '@/lib/actions/public-analytics.actions';

export const metadata: Metadata = {
  title: 'Community Dashboard',
  description:
    'Discover what the community is reading — trending books, active clubs, upcoming events, and more.',
};

export default async function CommunityPage() {
  // Parallel fetch all sections (server-side, cached)
  const [stats, trending, clubs, events, genres, feed, topBooks, trends] =
    await Promise.all([
      getCommunityStats(),
      getTrendingBooks('month', 8),
      getActiveClubs(6),
      getUpcomingEvents(8),
      getGenrePopularity('month'),
      getActivityFeed(20),
      getTopBooks('month', 5),
      getReadingTrendsPublic('month'),
    ]);

  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center py-24'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary' />
        </div>
      }
    >
      <CommunityDashboardClient
        initialData={{
          stats,
          trending,
          clubs,
          events,
          genres,
          feed,
          topBooks,
          trends,
        }}
      />
    </Suspense>
  );
}
