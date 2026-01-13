import { NextRequest, NextResponse } from 'next/server';
import { getReadingClubById } from '@/lib/actions/club-request.actions';

/**
 * GET /api/clubs/[id]
 * Get details for a specific reading club
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
          message: 'Club ID is required',
        },
        { status: 400 },
      );
    }

    const result = await getReadingClubById(id);

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
