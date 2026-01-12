import { Metadata } from 'next';
import { getUserClubRequests } from '@/lib/actions/club-request.actions';
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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClubEventRequest } from '@/types';

export const metadata: Metadata = {
  title: 'My Club & Event Requests',
  description: 'View and manage your reading club and event requests',
};

export default async function ClubRequestsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/sign-in?callbackUrl=/user/club-requests');
  }

  const requests = await getUserClubRequests();

  return (
    <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            My Club & Event Requests
          </h1>
          <p className='text-muted-foreground'>
            Track the status of your reading club and event submissions
          </p>
        </div>
        <Link href='/user/create-club-event'>
          <Button>Create New Request</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-muted-foreground'>
              You haven't created any club or event requests yet.
            </p>
            <Link href='/user/create-club-event'>
              <Button className='mt-4'>Create Your First Request</Button>
            </Link>
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
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'default'
                            : request.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {request.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      <span className='capitalize'>{request.type}</span> •{' '}
                      Created on{' '}
                      {new Date(request.createdAt).toLocaleDateString()}
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
                  <p className='line-clamp-3 text-sm text-muted-foreground'>
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
                  <div>
                    <h3 className='text-sm font-semibold'>Sessions</h3>
                    <p className='text-sm text-muted-foreground'>
                      {request.sessionCount}
                    </p>
                  </div>
                </div>
                {request.status === 'rejected' && request.rejectionReason && (
                  <div className='rounded-lg bg-destructive/10 p-4'>
                    <h3 className='font-semibold text-destructive'>
                      Rejection Reason
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {request.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
