import { NextRequest, NextResponse } from 'next/server';
import {
  getReadingTimeline,
  getGenrePreferences,
  getReviewStats,
  getParticipationHistory,
  getReadingStreak,
  getInteractionNetwork,
  getYearInBooks,
  getGoals,
  getAchievements,
  getPrivacySettings,
  getFullDashboardData,
  exportPersonalData,
} from '@/lib/actions/personal-analytics.actions';

// ── Rate limit ──

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const { searchParams } = req.nextUrl;
  const section = searchParams.get('section') ?? 'all';
  const period = searchParams.get('period') ?? 'year';
  const year = searchParams.get('year')
    ? parseInt(searchParams.get('year')!)
    : undefined;

  try {
    switch (section) {
      case 'timeline':
        return NextResponse.json(await getReadingTimeline(period));
      case 'genres':
        return NextResponse.json(await getGenrePreferences());
      case 'reviews':
        return NextResponse.json(await getReviewStats());
      case 'participation':
        return NextResponse.json(await getParticipationHistory());
      case 'streak':
        return NextResponse.json(await getReadingStreak());
      case 'interactions':
        return NextResponse.json(await getInteractionNetwork());
      case 'year-in-books':
        return NextResponse.json(await getYearInBooks(year));
      case 'goals':
        return NextResponse.json(await getGoals());
      case 'achievements':
        return NextResponse.json(await getAchievements());
      case 'privacy':
        return NextResponse.json(await getPrivacySettings());
      case 'export':
        return NextResponse.json(await exportPersonalData());
      case 'all':
      default:
        return NextResponse.json(await getFullDashboardData(period));
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
