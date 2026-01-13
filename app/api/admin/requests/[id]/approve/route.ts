import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { approveClubRequest } from '@/lib/actions/club-request.actions';

/**
 * PATCH /api/admin/requests/[id]/approve
 * Approve a club or event request
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Request ID is required' },
        { status: 400 },
      );
    }

    const result = await approveClubRequest(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // TODO: Send approval email notification
    // await sendApprovalEmail(requestDetails);

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
