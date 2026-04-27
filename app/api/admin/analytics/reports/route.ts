import { auth } from '@/auth';
import {
  generateAnalyticsReport,
  getAnalyticsReports,
} from '@/lib/actions/analytics.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');

  try {
    const result = await getAnalyticsReports(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await generateAnalyticsReport(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 },
    );
  }
}
