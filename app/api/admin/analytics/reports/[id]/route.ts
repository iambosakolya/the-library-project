import { auth } from '@/auth';
import {
  getAnalyticsReport,
  deleteAnalyticsReport,
} from '@/lib/actions/analytics.actions';
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
    const report = await getAnalyticsReport(id);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Report fetch error:', error);
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteAnalyticsReport(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 },
    );
  }
}
