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
import RegisterButton from '../register-button/register-button';
import Image from 'next/image';
import { detailsStyles, bookCardStyles } from './styles';
import { type ClubEventDetailsProps } from '../shared/types';

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
    <div className={detailsStyles.wrapper}>
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <div className={detailsStyles.headerBadges}>
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
              <CardTitle className={detailsStyles.title}>
                {data.title}
              </CardTitle>
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
          <div className={detailsStyles.infoGrid}>
            {/* Date Info */}
            <div className={detailsStyles.infoRow}>
              <CalendarIcon className={detailsStyles.infoIcon} />
              <span className={detailsStyles.infoLabel}>
                {isEvent ? 'Event Date:' : 'Start Date:'}
              </span>
              <span>{date ? format(new Date(date), 'PPP') : 'TBA'}</span>
            </div>

            {/* End Date for Clubs */}
            {!isEvent && endDate && (
              <div className={detailsStyles.infoRow}>
                <CalendarIcon className={detailsStyles.infoIcon} />
                <span className={detailsStyles.infoLabel}>End Date:</span>
                <span>{format(new Date(endDate), 'PPP')}</span>
              </div>
            )}

            {/* Session Count for Clubs */}
            {!isEvent && clubData && (
              <div className={detailsStyles.infoRow}>
                <ClockIcon className={detailsStyles.infoIcon} />
                <span className={detailsStyles.infoLabel}>Sessions:</span>
                <span>{clubData.sessionCount}</span>
              </div>
            )}

            {/* Capacity */}
            <div className={detailsStyles.infoRow}>
              <UsersIcon className={detailsStyles.infoIcon} />
              <span className={detailsStyles.infoLabel}>Capacity:</span>
              <span>
                {attendeeCount} / {data.capacity}
                {availableSeats > 0 ? (
                  <span className={detailsStyles.seatsAvailable}>
                    ({availableSeats} seats available)
                  </span>
                ) : (
                  <span className={detailsStyles.seatsFull}>(Full)</span>
                )}
              </span>
            </div>

            {/* Organizer/Creator */}
            <div className={detailsStyles.infoRow}>
              <UserIcon className={detailsStyles.infoIcon} />
              <span className={detailsStyles.infoLabel}>
                {isEvent ? 'Organizer:' : 'Creator:'}
              </span>
              <div className='flex items-center gap-2'>
                {organizerImage && (
                  <Image
                    src={organizerImage}
                    alt={organizerName || 'Organizer'}
                    width={20}
                    height={20}
                    className={detailsStyles.organizerImage}
                  />
                )}
                <span>{organizerName || 'Unknown'}</span>
              </div>
            </div>

            {/* Location/Link */}
            {data.format === 'offline' && data.address && (
              <div className={detailsStyles.infoRowStart}>
                <MapPinIcon className={detailsStyles.infoIconTop} />
                <div>
                  <span className={detailsStyles.infoLabel}>Location:</span>
                  <p className='mt-1'>{data.address}</p>
                </div>
              </div>
            )}

            {data.format === 'online' && data.onlineLink && (
              <div className={detailsStyles.infoRow}>
                <VideoIcon className={detailsStyles.infoIcon} />
                <span className={detailsStyles.infoLabel}>Online Link:</span>
                <a
                  href={data.onlineLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={detailsStyles.linkPrimary}
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
          <p className={detailsStyles.purposeText}>{data.purpose}</p>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={detailsStyles.detailedDescription}>
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
            <div className={bookCardStyles.grid}>
              {books.map((book) => (
                <div key={book.id} className={bookCardStyles.card}>
                  <div className={bookCardStyles.imageWrapper}>
                    <Image
                      src={book.images[0] || '/placeholder.png'}
                      alt={book.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className={bookCardStyles.infoWrapper}>
                    <h4 className={bookCardStyles.bookTitle}>{book.name}</h4>
                    <p className={bookCardStyles.bookAuthor}>{book.author}</p>
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
