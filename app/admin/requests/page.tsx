import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getPendingClubRequests } from '@/lib/actions/club-request.actions';
import PendingRequestsList from './pending-requests-list';
import { ClipboardListIcon } from 'lucide-react';
import { ClubEventRequest } from '@/types';

export const metadata: Metadata = {
  title: 'Moderate Requests - Admin',
  description: 'Review and moderate pending club and event requests',
};

type AdminRequestsPageProps = {
  searchParams: Promise<{
    search?: string;
    type?: string;
  }>;
};

export default async function AdminRequestsPage({
  searchParams,
}: AdminRequestsPageProps) {
  const session = await auth();

  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const params = await searchParams;
  const requests = await getPendingClubRequests();

  // Filter by search if provided
  let filteredRequests = requests;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredRequests = requests.filter(
      (req: ClubEventRequest) =>
        req.title.toLowerCase().includes(searchLower) ||
        req.description.toLowerCase().includes(searchLower) ||
        req.purpose.toLowerCase().includes(searchLower),
    );
  }

  const pendingCount = requests.filter(
    (r: ClubEventRequest) => r.status === 'pending',
  ).length;
  const clubCount = requests.filter(
    (r: ClubEventRequest) => r.type === 'club',
  ).length;
  const eventCount = requests.filter(
    (r: ClubEventRequest) => r.type === 'event',
  ).length;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <ClipboardListIcon className='h-8 w-8' />
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Moderate Requests
            </h1>
            <p className='text-muted-foreground'>
              Review and approve or reject club and event submissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='text-2xl font-bold'>{pendingCount}</div>
          <p className='text-sm text-muted-foreground'>Pending Requests</p>
        </div>
        <div className='rounded-lg border bg-card p-4'>
          <div className='text-2xl font-bold'>{clubCount}</div>
          <p className='text-sm text-muted-foreground'>Club Requests</p>
        </div>
        <div className='rounded-lg border bg-card p-4'>
          <div className='text-2xl font-bold'>{eventCount}</div>
          <p className='text-sm text-muted-foreground'>Event Requests</p>
        </div>
      </div>

      {/* Requests List */}
      <PendingRequestsList initialRequests={filteredRequests} />
    </div>
  );
}
