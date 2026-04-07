import {
  getTrendingBooks,
  getActiveClubs,
  getUpcomingEvents,
  getGenrePopularity,
  getActivityFeed,
  getTopBooks,
  getCommunityStats,
  getReadingTrendsPublic,
} from '@/lib/actions/public-analytics.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const section = searchParams.get('section');
  const period = searchParams.get('period') ?? 'month';

  try {
    switch (section) {
      case 'trending':
        return NextResponse.json(await getTrendingBooks(period));
      case 'clubs':
        return NextResponse.json(await getActiveClubs());
      case 'events':
        return NextResponse.json(await getUpcomingEvents());
      case 'genres':
        return NextResponse.json(await getGenrePopularity(period));
      case 'feed':
        return NextResponse.json(await getActivityFeed());
      case 'top-books':
        return NextResponse.json(await getTopBooks(period));
      case 'stats':
        return NextResponse.json(await getCommunityStats());
      case 'trends':
        return NextResponse.json(await getReadingTrendsPublic(period));
      case 'all': {
        const [trending, clubs, events, genres, feed, topBooks, stats, trends] =
          await Promise.all([
            getTrendingBooks(period),
            getActiveClubs(),
            getUpcomingEvents(),
            getGenrePopularity(period),
            getActivityFeed(),
            getTopBooks(period),
            getCommunityStats(),
            getReadingTrendsPublic(period),
          ]);
        return NextResponse.json({
          trending,
          clubs,
          events,
          genres,
          feed,
          topBooks,
          stats,
          trends,
        });
      }
      default:
        return NextResponse.json(
          {
            error:
              'Invalid section. Use: trending, clubs, events, genres, feed, top-books, stats, trends, or all',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Public analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }
}
