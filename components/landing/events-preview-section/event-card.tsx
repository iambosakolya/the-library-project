'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarDays, MapPin, Users, Video } from 'lucide-react';
import { format } from 'date-fns';
import type { Event as EventType } from '@/types';
import { cardStyles } from './styles';
import type { colorPalettes } from './constants';

export function EventCard({
  event,
  palette,
}: {
  event: EventType;
  palette: (typeof colorPalettes)[number];
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.45 }}
      className={cardStyles.wrapper}
    >
      {/* card header gradient */}
      <div
        className={`${cardStyles.header} bg-gradient-to-br ${palette.color}`}
      >
        <span className={`${cardStyles.badge} ${palette.accent}`}>
          {event.format === 'online' ? 'Online' : 'In-Person'}
        </span>
      </div>

      <div className={cardStyles.body}>
        <Link href={`/events/${event.id}`} className={cardStyles.title}>
          {event.title}
        </Link>
        {event.description && (
          <p className={cardStyles.description}>{event.description}</p>
        )}
        <div className={cardStyles.metaWrapper}>
          <div className={cardStyles.metaRow}>
            <CalendarDays className={cardStyles.metaIcon} />
            <span>{format(new Date(event.eventDate), 'PPP')}</span>
          </div>
          <div className={cardStyles.metaRow}>
            {event.format === 'online' ? (
              <Video className={cardStyles.metaIcon} />
            ) : (
              <MapPin className={cardStyles.metaIcon} />
            )}
            <span>
              {event.format === 'online' ? 'Online' : event.address || 'TBA'}
            </span>
          </div>
          <div className={cardStyles.metaRow}>
            <Users className={cardStyles.metaIcon} />
            <span>
              {event.attendeeIds?.length || 0} / {event.capacity} attendees
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
