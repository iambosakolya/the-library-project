import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/actions/club-request.actions';

/**
 * GET /api/events
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - format: 'online' | 'offline' (optional)
 * - search: string (optional) - searches in title, description, and purpose
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const format = searchParams.get('format') as 'online' | 'offline' | null;
    const search = searchParams.get('search') || undefined;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid pagination parameters',
        },
        { status: 400 },
      );
    }

    // Validate format if provided
    if (format && format !== 'online' && format !== 'offline') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid format. Must be "online" or "offline"',
        },
        { status: 400 },
      );
    }

    // Parse dates if provided
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateStr) {
      startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid startDate format',
          },
          { status: 400 },
        );
      }
    }

    if (endDateStr) {
      endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid endDate format',
          },
          { status: 400 },
        );
      }
    }

    const result = await getEvents({
      page,
      limit,
      format: format || undefined,
      search,
      startDate,
      endDate,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
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
