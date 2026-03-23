import { NextRequest } from 'next/server';
import { refreshAllSummaries } from '@/lib/actions/review-summary.actions';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: 'AI service is not configured' },
      { status: 503 },
    );
  }

  try {
    const result = await refreshAllSummaries();

    if (!result.success) {
      return Response.json({ error: result.message }, { status: 500 });
    }

    return Response.json({
      message: 'Review summaries refreshed',
      ...result.data,
    });
  } catch (error) {
    console.error('[review-summaries] Error:', error);
    return Response.json(
      { error: 'Failed to refresh summaries' },
      { status: 500 },
    );
  }
}
