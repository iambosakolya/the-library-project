'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Globe, MapPin, Users, BookOpen } from 'lucide-react';

import { EventData } from '../shared/types';
import { formatEventDate } from './utils';
import { upcomingEventsCalendarStyles as styles } from './styles';

export default function UpcomingEventsCalendar({
  events,
}: {
  events: EventData[];
}) {
  if (!events?.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No upcoming events scheduled.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Calendar className={styles.headerIcon} />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.list}>
          {events.map((event) => {
            const { month, day, time } = formatEventDate(event.eventDate);
            return (
              <div key={event.id} className={styles.eventRow}>
                {/* Date block */}
                <div className={styles.dateBlock}>
                  <span className={styles.month}>{month}</span>
                  <span className={styles.day}>{day}</span>
                </div>

                {/* Content */}
                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <Badge
                      variant={
                        event.format === 'online' ? 'default' : 'secondary'
                      }
                      className={styles.formatBadge}
                    >
                      {event.format === 'online' ? (
                        <>
                          <Globe className={styles.formatIcon} /> Online
                        </>
                      ) : (
                        <>
                          <MapPin className={styles.formatIcon} /> In-Person
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className={styles.description}>{event.description}</p>
                  <div className={styles.metaRow}>
                    <span>{time}</span>
                    <span className={styles.metaItem}>
                      <Users className={styles.metaIcon} />
                      {event.attendeeCount}/{event.capacity}
                    </span>
                    {event.bookCount > 0 && (
                      <span className={styles.metaItem}>
                        <BookOpen className={styles.metaIcon} />
                        {event.bookCount}
                      </span>
                    )}
                    <span>by {event.organizerName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
