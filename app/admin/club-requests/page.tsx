import { Metadata } from 'next';
import { getPendingClubRequests } from '@/lib/actions/club-request.actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ClubRequestActions from '@/app/admin/club-requests/club-request-actions';
import { ClubEventRequest } from '@/types';

export const metadata: Metadata = {
  title: 'Manage Club Requests - Admin',
  description: 'Review and approve reading club and event requests',
};

export default async function AdminClubRequestsPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const requests = await getPendingClubRequests();

  return (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Pending Club & Event Requests
        </h1>
        <p className='text-muted-foreground'>
          Review and approve or reject user-submitted reading clubs and events
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-muted-foreground'>
              No pending requests at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6'>
          {requests.map((request: ClubEventRequest) => (
            <Card key={request.id}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='flex items-center gap-2'>
                      {request.title}
                      <Badge variant='secondary' className='capitalize'>
                        {request.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Submitted by {request.user?.name} ({request.user?.email})
                      • {new Date(request.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='font-semibold'>Purpose</h3>
                  <p className='text-sm text-muted-foreground'>
                    {request.purpose}
                  </p>
                </div>
                <div>
                  <h3 className='font-semibold'>Description</h3>
                  <p className='text-sm text-muted-foreground'>
                    {request.description}
                  </p>
                </div>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <div>
                    <h3 className='text-sm font-semibold'>Start Date</h3>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(request.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {request.endDate && (
                    <div>
                      <h3 className='text-sm font-semibold'>End Date</h3>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className='text-sm font-semibold'>Capacity</h3>
                    <p className='text-sm text-muted-foreground'>
                      {request.capacity} people
                    </p>
                  </div>
                  <div>
                    <h3 className='text-sm font-semibold'>Format</h3>
                    <p className='text-sm capitalize text-muted-foreground'>
                      {request.format}
                    </p>
                  </div>
                </div>
                {request.format === 'offline' && request.address && (
                  <div>
                    <h3 className='text-sm font-semibold'>Address</h3>
                    <p className='text-sm text-muted-foreground'>
                      {request.address}
                    </p>
                  </div>
                )}
                {request.format === 'online' && request.onlineLink && (
                  <div>
                    <h3 className='text-sm font-semibold'>Online Link</h3>
                    <p className='break-all text-sm text-muted-foreground'>
                      {request.onlineLink}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className='text-sm font-semibold'>Number of Sessions</h3>
                  <p className='text-sm text-muted-foreground'>
                    {request.sessionCount}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-semibold'>Selected Books</h3>
                  <p className='text-sm text-muted-foreground'>
                    {request.bookIds.length} book(s) selected
                  </p>
                </div>
                <ClubRequestActions requestId={request.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
