import { getEventById } from '@/lib/actions/club-request.actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  BookOpenIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

type EventDetailPageProps = {
  params: {
    id: string;
  };
};

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const result = await getEventById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='mb-2 text-4xl font-bold'>{event.title}</h1>
            <p className='text-lg text-muted-foreground'>{event.purpose}</p>
          </div>
          <Badge
            variant={event.format === 'online' ? 'default' : 'secondary'}
            className='text-sm'
          >
            {event.format === 'online' ? (
              <VideoIcon className='mr-1 h-4 w-4' />
            ) : (
              <MapPinIcon className='mr-1 h-4 w-4' />
            )}
            {event.format}
          </Badge>
        </div>

        {/* Quick Info */}
        <div className='flex flex-wrap gap-4 text-sm'>
          <div className='flex items-center'>
            <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>{format(new Date(event.eventDate), 'PPPp')}</span>
          </div>
          <div className='flex items-center'>
            <UsersIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>
              {event.attendeeIds.length} / {event.capacity} attendees
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mb-8 grid gap-6'>
        {/* Description Card */}
        <Card>
          <CardHeader>
            <CardTitle>About This Event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap'>{event.description}</p>
          </CardContent>
        </Card>

        {/* Location/Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {event.format === 'online' ? 'Meeting Link' : 'Location'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.format === 'online' && event.onlineLink ? (
              <div className='flex items-center gap-2'>
                <VideoIcon className='h-5 w-5 text-muted-foreground' />
                <a
                  href={event.onlineLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  {event.onlineLink}
                </a>
              </div>
            ) : event.format === 'offline' && event.address ? (
              <div className='flex items-center gap-2'>
                <MapPinIcon className='h-5 w-5 text-muted-foreground' />
                <span>{event.address}</span>
              </div>
            ) : (
              <p className='text-muted-foreground'>
                Location details will be shared with attendees
              </p>
            )}
          </CardContent>
        </Card>

        {/* Organizer Card */}
        {event.organizer && (
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-3'>
                {event.organizer.image && (
                  <Image
                    src={event.organizer.image}
                    alt={event.organizer.name}
                    width={48}
                    height={48}
                    className='h-12 w-12 rounded-full'
                  />
                )}
                <div>
                  <p className='font-medium'>{event.organizer.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {event.organizer.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Books Card */}
        {event.bookIds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BookOpenIcon className='h-5 w-5' />
                Related Books
              </CardTitle>
              <CardDescription>
                {event.bookIds.length} book
                {event.bookIds.length !== 1 ? 's' : ''} featured in this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Book details will be visible to registered attendees
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4'>
        <Button
          size='lg'
          className='flex-1'
          disabled={event.attendeeIds.length >= event.capacity}
        >
          {event.attendeeIds.length >= event.capacity
            ? 'Event Full'
            : 'Register for Event'}
        </Button>
        <Link href='/events'>
          <Button size='lg' variant='outline'>
            Back to Events
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventDetailPage;
