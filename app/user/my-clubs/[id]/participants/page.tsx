import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  getParticipants,
  getAttendanceRecords,
  getClubEventForEdit,
} from '@/lib/actions/organizer.actions';
import ParticipantListView from '@/components/shared/participant-list-view';

export const metadata: Metadata = {
  title: 'Participant List',
  description: 'View and manage participants for your club or event',
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export default async function ParticipantsPage({
  params,
  searchParams,
}: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user/my-clubs');
  }

  const { id } = await params;
  const { type: rawType } = await searchParams;
  const type = (rawType === 'event' ? 'event' : 'club') as 'club' | 'event';

  const [participantsResult, attendanceResult, entityResult] =
    await Promise.all([
      getParticipants(id, type),
      getAttendanceRecords(id, type),
      getClubEventForEdit(id, type),
    ]);

  if (!participantsResult.success || !entityResult.success) {
    redirect('/user/my-clubs');
  }

  const entity = entityResult.data;
  const sessionCount =
    type === 'club' ? entity?.sessionCount || 1 : 1;

  return (
    <div className='mx-auto max-w-7xl space-y-8 px-4 py-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Participants — {entity?.title}
        </h1>
        <p className='text-muted-foreground'>
          View participant list, track attendance, and communicate with members
        </p>
      </div>

      <ParticipantListView
        participants={participantsResult.data || []}
        attendanceRecords={attendanceResult.data || []}
        entityId={id}
        entityType={type}
        entityTitle={entity?.title || ''}
        totalSessions={sessionCount}
      />
    </div>
  );
}
