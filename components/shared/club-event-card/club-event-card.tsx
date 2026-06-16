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
import { cardStyles, badgeIcon } from './styles';
import { type ClubEventCardProps } from '../shared/types';

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
    <Card className={cardStyles.wrapper}>
      <CardHeader className={cardStyles.header}>
        <div className={cardStyles.headerRow}>
          <Link href={linkHref} className='flex-1'>
            <h3 className={cardStyles.title}>{data.title}</h3>
          </Link>
          <Badge variant={data.format === 'online' ? 'default' : 'secondary'}>
            {data.format === 'online' ? (
              <VideoIcon className={badgeIcon} />
            ) : (
              <MapPinIcon className={badgeIcon} />
            )}
            {data.format}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cardStyles.content}>
        <p className={cardStyles.description}>{data.description}</p>

        <div className={cardStyles.detailsSection}>
          <div className={cardStyles.detailRow}>
            <CalendarIcon className={cardStyles.detailIcon} />
            <span>
              {date && format(new Date(date), 'PPP')}
              {!isEvent && clubData?.endDate && (
                <> - {format(new Date(clubData.endDate), 'PPP')}</>
              )}
            </span>
          </div>

          {data.format === 'offline' && data.address && (
            <div className={cardStyles.detailRow}>
              <MapPinIcon className={cardStyles.detailIcon} />
              <span className={cardStyles.locationText}>{data.address}</span>
            </div>
          )}

          <div className={cardStyles.detailRow}>
            <UsersIcon className={cardStyles.detailIcon} />
            <span>
              {attendeeCount} / {data.capacity}{' '}
              {isEvent ? 'attendees' : 'members'}
            </span>
          </div>
        </div>

        {!isEvent && clubData && (
          <div className='pt-2'>
            <Badge variant='outline' className={cardStyles.sessionBadge}>
              {clubData.sessionCount} sessions
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className={cardStyles.footer}>
        <div className={cardStyles.footerRow}>
          <div className={cardStyles.organizer}>
            by{' '}
            <span className={cardStyles.organizerName}>
              {organizerName || 'Unknown'}
            </span>
          </div>
          <Link href={linkHref} className={cardStyles.viewLink}>
            View Details →
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClubEventCard;
