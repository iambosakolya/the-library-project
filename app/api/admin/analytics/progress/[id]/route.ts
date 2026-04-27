import { auth } from '@/auth';
import { getReportProgress } from '@/lib/actions/analytics.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const progress = await getReportProgress(id);
    if (!progress) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 },
    );
  }
}
