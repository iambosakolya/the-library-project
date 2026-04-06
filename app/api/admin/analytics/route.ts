import { auth } from '@/auth';
import {
  getReadingTrends,
  getCommunityEngagement,
  getEventsClubsAnalytics,
  getUserBehavior,
} from '@/lib/actions/analytics.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') ?? 'reading_trends';
  const period = searchParams.get('period') ?? 'last_30';
  const customStart = searchParams.get('startDate') ?? undefined;
  const customEnd = searchParams.get('endDate') ?? undefined;

  try {
    let data;
    switch (category) {
      case 'reading_trends':
        data = await getReadingTrends(period, customStart, customEnd);
        break;
      case 'community_engagement':
        data = await getCommunityEngagement(period, customStart, customEnd);
        break;
      case 'events_clubs':
        data = await getEventsClubsAnalytics(period, customStart, customEnd);
        break;
      case 'user_behavior':
        data = await getUserBehavior(period, customStart, customEnd);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 },
        );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    );
  }
}
