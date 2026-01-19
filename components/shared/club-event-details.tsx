'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReadingClub, Event } from '@/types';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import RegisterButton from './register-button';
import Image from 'next/image';

type ClubEventDetailsProps = {
  data: ReadingClub | Event;
  type: 'club' | 'event';
  isRegistered: boolean;
  registrationId?: string;
  isAuthenticated: boolean;
  books?: Array<{ id: string; name: string; images: string[]; author: string }>;
};

export default function ClubEventDetails({
  data,
  type,
  isRegistered,
  registrationId,
  isAuthenticated,
  books = [],
}: ClubEventDetailsProps) {
  const isEvent = type === 'event';
  const eventData = isEvent ? (data as Event) : null;
  const clubData = !isEvent ? (data as ReadingClub) : null;

  const date = isEvent ? eventData?.eventDate : clubData?.startDate;
  const endDate = !isEvent ? clubData?.endDate : null;

  const organizerName = isEvent
    ? eventData?.organizer?.name
    : clubData?.creator?.name;

  const organizerImage = isEvent
    ? eventData?.organizer?.image
    : clubData?.creator?.image;

  const attendeeCount = isEvent
    ? eventData?.attendeeIds.length || 0
    : clubData?.memberIds.length || 0;

  const availableSeats = data.capacity - attendeeCount;

  const isPast = date ? new Date(date) < new Date() : false;

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <Card>
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
                {!data.isActive && (
                  <Badge variant='destructive'>Inactive</Badge>
                )}
              </div>
              <CardTitle className='text-3xl'>{data.title}</CardTitle>
            </div>
            <RegisterButton
              clubId={clubData?.id}
              eventId={eventData?.id}
              type={type}
              isRegistered={isRegistered}
              registrationId={registrationId}
              availableSeats={availableSeats}
              isAuthenticated={isAuthenticated}
              isPast={isPast}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Date Info */}
            <div className='flex items-center gap-2 text-sm'>
              <CalendarIcon className='h-4 w-4 text-muted-foreground' />
              <span className='font-medium'>
                {isEvent ? 'Event Date:' : 'Start Date:'}
              </span>
              <span>{date ? format(new Date(date), 'PPP') : 'TBA'}</span>
            </div>

            {/* End Date for Clubs */}
            {!isEvent && endDate && (
              <div className='flex items-center gap-2 text-sm'>
                <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>End Date:</span>
                <span>{format(new Date(endDate), 'PPP')}</span>
              </div>
            )}

            {/* Session Count for Clubs */}
            {!isEvent && clubData && (
              <div className='flex items-center gap-2 text-sm'>
                <ClockIcon className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>Sessions:</span>
                <span>{clubData.sessionCount}</span>
              </div>
            )}

            {/* Capacity */}
            <div className='flex items-center gap-2 text-sm'>
              <UsersIcon className='h-4 w-4 text-muted-foreground' />
              <span className='font-medium'>Capacity:</span>
              <span>
                {attendeeCount} / {data.capacity}
                {availableSeats > 0 ? (
                  <span className='ml-2 text-green-600'>
                    ({availableSeats} seats available)
                  </span>
                ) : (
                  <span className='ml-2 text-red-600'>(Full)</span>
                )}
              </span>
            </div>

            {/* Organizer/Creator */}
            <div className='flex items-center gap-2 text-sm'>
              <UserIcon className='h-4 w-4 text-muted-foreground' />
              <span className='font-medium'>
                {isEvent ? 'Organizer:' : 'Creator:'}
              </span>
              <div className='flex items-center gap-2'>
                {organizerImage && (
                  <Image
                    src={organizerImage}
                    alt={organizerName || 'Organizer'}
                    width={20}
                    height={20}
                    className='rounded-full'
                  />
                )}
                <span>{organizerName || 'Unknown'}</span>
              </div>
            </div>

            {/* Location/Link */}
            {data.format === 'offline' && data.address && (
              <div className='flex items-start gap-2 text-sm md:col-span-2'>
                <MapPinIcon className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <span className='font-medium'>Location:</span>
                  <p className='mt-1'>{data.address}</p>
                </div>
              </div>
            )}

            {data.format === 'online' && data.onlineLink && (
              <div className='flex items-center gap-2 text-sm md:col-span-2'>
                <VideoIcon className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>Online Link:</span>
                <a
                  href={data.onlineLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  Join Meeting
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Purpose Section */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>{data.purpose}</p>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap text-muted-foreground'>
            {data.description}
          </p>
        </CardContent>
      </Card>

      {/* Books Section */}
      {books.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpenIcon className='h-5 w-5' />
              Books ({books.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {books.map((book) => (
                <div
                  key={book.id}
                  className='flex gap-3 rounded-lg border p-3 transition-shadow hover:shadow-md'
                >
                  <div className='relative h-24 w-16 flex-shrink-0 overflow-hidden rounded'>
                    <Image
                      src={book.images[0] || '/placeholder.png'}
                      alt={book.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <h4 className='line-clamp-2 font-medium'>{book.name}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {book.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
