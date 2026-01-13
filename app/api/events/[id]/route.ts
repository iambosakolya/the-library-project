import { NextRequest, NextResponse } from 'next/server';
import { getEventById } from '@/lib/actions/club-request.actions';

/**
 * GET /api/events/[id]
 * Get details for a specific event
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event ID is required',
        },
        { status: 400 },
      );
    }

    const result = await getEventById(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    );
  }
}
