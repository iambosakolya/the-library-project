import { getUserRegistrations } from '@/lib/actions/registration.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Registration } from '@/types';

const MyRegistrationsPage = async () => {
  const result = await getUserRegistrations();

  if (!result.success || !result.data) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <AlertCircleIcon className='mb-4 h-12 w-12 text-muted-foreground' />
            <h3 className='mb-2 text-lg font-semibold'>
              {result.message || 'Unable to load registrations'}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Please try again later or contact support if the problem persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const registrations = result.data as Registration[];

  // Separate active and cancelled registrations
  const activeRegistrations = registrations.filter(
    (r) => r.status === 'active',
  );
  const cancelledRegistrations = registrations.filter(
    (r) => r.status === 'cancelled',
  );

  // Further separate active into upcoming and past
  const upcomingRegistrations = activeRegistrations.filter((r) => {
    const date = r.clubId ? r.club?.startDate : r.event?.eventDate;
    return date ? isFuture(new Date(date)) : false;
  });

  const pastRegistrations = activeRegistrations.filter((r) => {
    const date = r.clubId ? r.club?.startDate : r.event?.eventDate;
    return date ? isPast(new Date(date)) : false;
  });

  const RegistrationCard = ({
    registration,
  }: {
    registration: Registration;
  }) => {
    const isClub = !!registration.clubId;
    const data = isClub ? registration.club : registration.event;
    const type = isClub ? 'club' : 'event';
    const linkHref = isClub
      ? `/clubs/${registration.clubId}`
      : `/events/${registration.eventId}`;

    if (!data) return null;

    const clubData = isClub ? registration.club : null;
    const eventData = !isClub ? registration.event : null;

    const date = isClub ? clubData?.startDate : eventData?.eventDate;
    const organizerName = isClub
      ? clubData?.creator?.name
      : eventData?.organizer?.name;
    const organizerImage = isClub
      ? clubData?.creator?.image
      : eventData?.organizer?.image;

    const attendeeCount = isClub
      ? clubData?.memberIds?.length || 0
      : eventData?.attendeeIds?.length || 0;

    const isCancelled = registration.status === 'cancelled';

    return (
      <Card className='transition-shadow hover:shadow-lg'>
        <CardHeader>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <div className='mb-2 flex flex-wrap gap-2'>
                <Badge
                  variant={data.format === 'online' ? 'default' : 'secondary'}
                >
                  {data.format === 'online' ? (
                    <>
                      <VideoIcon className='mr-1 h-3 w-3' />
                      Online
                    </>
                  ) : (
                    <>
                      <MapPinIcon className='mr-1 h-3 w-3' />
                      Offline
                    </>
                  )}
                </Badge>
                <Badge variant='outline'>
                  {type === 'club' ? 'Reading Club' : 'Event'}
                </Badge>
                {isCancelled && <Badge variant='destructive'>Cancelled</Badge>}
              </div>
              <Link href={linkHref}>
                <CardTitle className='line-clamp-2 transition-colors hover:text-primary'>
                  {data.title}
                </CardTitle>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {/* Purpose */}
            <p className='line-clamp-2 text-sm text-muted-foreground'>
              {data.purpose}
            </p>

            {/* Info */}
            <div className='flex flex-col gap-2 text-sm'>
              <div className='flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                <span>{date ? format(new Date(date), 'PPP') : 'TBA'}</span>
              </div>

              <div className='flex items-center gap-2'>
                <UsersIcon className='h-4 w-4 text-muted-foreground' />
                <span>
                  {attendeeCount} / {data.capacity}{' '}
                  {type === 'club' ? 'members' : 'attendees'}
                </span>
              </div>

              {/* Organizer */}
              <div className='flex items-center gap-2'>
                {organizerImage && (
                  <Image
                    src={organizerImage}
                    alt={organizerName || 'Organizer'}
                    width={16}
                    height={16}
                    className='rounded-full'
                  />
                )}
                <span className='text-muted-foreground'>
                  by {organizerName || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Registration Date */}
            <div className='border-t pt-3 text-xs text-muted-foreground'>
              Registered on {format(new Date(registration.registeredAt), 'PPP')}
              {isCancelled && registration.cancelledAt && (
                <>
                  {' • '}
                  Cancelled on{' '}
                  {format(new Date(registration.cancelledAt), 'PPP')}
                </>
              )}
            </div>

            {/* Action Button */}
            <Link href={linkHref}>
              <Button variant='outline' className='w-full'>
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <Card>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <AlertCircleIcon className='mb-4 h-12 w-12 text-muted-foreground' />
        <p className='text-muted-foreground'>{message}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>My Registrations</h1>
        <p className='text-muted-foreground'>
          Manage your reading club memberships and event registrations
        </p>
      </div>

      <Tabs defaultValue='upcoming' className='space-y-6'>
        <TabsList className='grid w-full max-w-md grid-cols-3'>
          <TabsTrigger value='upcoming'>
            Upcoming ({upcomingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value='past'>
            Past ({pastRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value='cancelled'>
            Cancelled ({cancelledRegistrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='upcoming' className='space-y-4'>
          {upcomingRegistrations.length === 0 ? (
            <EmptyState message='You have no upcoming registrations. Browse clubs and events to join!' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {upcomingRegistrations.map((registration) => (
                <RegistrationCard
                  key={registration.id}
                  registration={registration}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='past' className='space-y-4'>
          {pastRegistrations.length === 0 ? (
            <EmptyState message='You have no past registrations.' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {pastRegistrations.map((registration) => (
                <RegistrationCard
                  key={registration.id}
                  registration={registration}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='cancelled' className='space-y-4'>
          {cancelledRegistrations.length === 0 ? (
            <EmptyState message='You have no cancelled registrations.' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {cancelledRegistrations.map((registration) => (
                <RegistrationCard
                  key={registration.id}
                  registration={registration}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRegistrationsPage;
