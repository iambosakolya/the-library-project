import {
  getMostDiscussedBooks,
  getRatingDistribution,
  getAuthorSpotlight,
  getSeasonalityTrends,
  getBookDiscoveryPaths,
  getClubReadingPreferences,
  getRisingBooks,
  getReadingInsightsData,
} from '@/lib/actions/reading-insights.actions';
import { NextRequest, NextResponse } from 'next/server';

// ── Simple rate-limit (in-memory, per-IP) ──

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function GET(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const { searchParams } = req.nextUrl;
  const section = searchParams.get('section');
  const period = searchParams.get('period') ?? 'month';
  const genre = searchParams.get('genre') ?? undefined;

  try {
    switch (section) {
      case 'most-discussed':
        return NextResponse.json(await getMostDiscussedBooks(period, genre));
      case 'rating-distribution':
        return NextResponse.json(await getRatingDistribution(period));
      case 'author-spotlight':
        return NextResponse.json(await getAuthorSpotlight(period));
      case 'seasonality':
        return NextResponse.json(await getSeasonalityTrends());
      case 'discovery-paths':
        return NextResponse.json(await getBookDiscoveryPaths());
      case 'club-preferences':
        return NextResponse.json(await getClubReadingPreferences());
      case 'rising-books':
        return NextResponse.json(await getRisingBooks(period));
      case 'all': {
        const data = await getReadingInsightsData(period, genre);
        return NextResponse.json(data);
      }
      default:
        return NextResponse.json(
          {
            error:
              'Invalid section. Use: most-discussed, rating-distribution, author-spotlight, seasonality, discovery-paths, club-preferences, rising-books, or all',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Reading insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading insights data' },
      { status: 500 },
    );
  }
}
