'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ReadingClub, Event } from '@/types';
import { CalendarIcon, MapPinIcon, UsersIcon, VideoIcon } from 'lucide-react';
import { format } from 'date-fns';

type ClubEventCardProps = {
  data: ReadingClub | Event;
  type: 'club' | 'event';
};

const ClubEventCard = ({ data, type }: ClubEventCardProps) => {
  const isEvent = type === 'event';
  const eventData = isEvent ? (data as Event) : null;
  const clubData = !isEvent ? (data as ReadingClub) : null;

  const date = isEvent ? eventData?.eventDate : clubData?.startDate;

  const organizerName = isEvent
    ? eventData?.organizer?.name
    : clubData?.creator?.name;

  const attendeeCount = isEvent
    ? eventData?.attendeeIds.length
    : clubData?.memberIds.length;

  const linkHref = isEvent ? `/events/${data.id}` : `/clubs/${data.id}`;

  return (
    <Card className='flex h-full w-full flex-col transition-shadow hover:shadow-lg'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <Link href={linkHref} className='flex-1'>
            <h3 className='line-clamp-2 text-xl font-bold transition-colors hover:text-primary'>
              {data.title}
            </h3>
          </Link>
          <Badge variant={data.format === 'online' ? 'default' : 'secondary'}>
            {data.format === 'online' ? (
              <VideoIcon className='mr-1 h-3 w-3' />
            ) : (
              <MapPinIcon className='mr-1 h-3 w-3' />
            )}
            {data.format}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='flex-1 space-y-3'>
        <p className='line-clamp-3 text-sm text-muted-foreground'>
          {data.description}
        </p>

        <div className='space-y-2'>
          <div className='flex items-center text-sm'>
            <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>
              {date && format(new Date(date), 'PPP')}
              {!isEvent && clubData?.endDate && (
                <> - {format(new Date(clubData.endDate), 'PPP')}</>
              )}
            </span>
          </div>

          {data.format === 'offline' && data.address && (
            <div className='flex items-center text-sm'>
              <MapPinIcon className='mr-2 h-4 w-4 text-muted-foreground' />
              <span className='line-clamp-1'>{data.address}</span>
            </div>
          )}

          <div className='flex items-center text-sm'>
            <UsersIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>
              {attendeeCount} / {data.capacity}{' '}
              {isEvent ? 'attendees' : 'members'}
            </span>
          </div>
        </div>

        {!isEvent && clubData && (
          <div className='pt-2'>
            <Badge variant='outline' className='text-xs'>
              {clubData.sessionCount} sessions
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className='border-t pt-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            by <span className='font-medium'>{organizerName || 'Unknown'}</span>
          </div>
          <Link
            href={linkHref}
            className='text-sm font-medium text-primary hover:underline'
          >
            View Details →
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClubEventCard;
