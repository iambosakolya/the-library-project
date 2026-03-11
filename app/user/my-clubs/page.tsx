import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMyClubsAndEvents } from '@/lib/actions/organizer.actions';
import { MyClubOrEvent } from '@/types';
import MyClubsDashboard from '@/components/shared/my-clubs-dashboard';

export const metadata: Metadata = {
  title: 'My Clubs & Events Dashboard',
  description: 'Manage your created reading clubs and events',
};

export default async function MyClubsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/sign-in?callbackUrl=/user/my-clubs');
  }

  const result = await getMyClubsAndEvents();

  if (!result.success) {
    return (
      <div className='mx-auto max-w-7xl space-y-8 px-4 py-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            My Clubs & Events Dashboard
          </h1>
          <p className='text-destructive'>
            {result.message || 'Failed to load your clubs and events.'}
          </p>
        </div>
      </div>
    );
  }

  const items: MyClubOrEvent[] = result.data ?? [];

  return (
    <div className='mx-auto max-w-7xl space-y-8 px-4 py-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          My Clubs & Events Dashboard
        </h1>
        <p className='text-muted-foreground'>
          Track and manage your created reading clubs, events, and participant
          engagement
        </p>
      </div>

      <MyClubsDashboard items={items} />
    </div>
  );
}
