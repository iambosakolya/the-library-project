import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { rejectClubRequest } from '@/lib/actions/club-request.actions';

/**
 * PATCH /api/admin/requests/[id]/reject
 * Reject a club or event request with reason
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Request ID is required' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { success: false, message: 'Rejection reason is required' },
        { status: 400 },
      );
    }

    const result = await rejectClubRequest(id, reason);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // TODO: Send rejection email notification
    // await sendRejectionEmail(requestDetails, reason);

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
