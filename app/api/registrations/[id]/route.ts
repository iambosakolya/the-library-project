import { NextRequest, NextResponse } from 'next/server';
import {
  cancelRegistration,
  canCancelRegistration,
} from '@/lib/actions/registration.actions';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * DELETE /api/registrations/[id]
 * Cancel a specific registration
 * Query params:
 * - reason: string (optional) - reason for cancellation
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const reason = searchParams.get('reason') || undefined;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration ID is required',
        },
        { status: 400 },
      );
    }

    // Check if cancellation is allowed
    const canCancelResult = await canCancelRegistration(id);
    if (!canCancelResult.canCancel) {
      return NextResponse.json(
        {
          success: false,
          message:
            canCancelResult.message ||
            'Cannot cancel this registration at this time',
        },
        { status: 400 },
      );
    }

    const result = await cancelRegistration(id, reason);

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
