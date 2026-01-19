import { NextRequest, NextResponse } from 'next/server';
import {
  registerForClubOrEvent,
  cancelRegistration,
  getUserRegistrations,
  checkUserRegistration,
} from '@/lib/actions/registration.actions';

/**
 * POST /api/registrations
 * Register for a club or event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await registerForClubOrEvent(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error registering:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while registering',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/registrations
 * Get user's registrations
 * Query params:
 * - clubId: string (optional) - check if registered for specific club
 * - eventId: string (optional) - check if registered for specific event
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clubId = searchParams.get('clubId');
    const eventId = searchParams.get('eventId');

    // If checking specific registration
    if (clubId || eventId) {
      const result = await checkUserRegistration(
        clubId || undefined,
        eventId || undefined,
      );

      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }

      return NextResponse.json(result);
    }

    // Get all user registrations
    const result = await getUserRegistrations();

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching registrations',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/registrations?id=registrationId
 * Cancel a registration (legacy endpoint - use /api/registrations/[id] instead)
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const registrationId = searchParams.get('id');
    const reason = searchParams.get('reason') || undefined;

    if (!registrationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration ID is required',
        },
        { status: 400 },
      );
    }

    const result = await cancelRegistration(registrationId, reason);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while cancelling registration',
      },
      { status: 500 },
    );
  }
}
