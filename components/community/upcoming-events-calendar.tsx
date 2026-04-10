'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Globe, MapPin, Users, BookOpen } from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  format: string;
  attendeeCount: number;
  organizerName: string;
  bookCount: number;
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return { month, day, time };
}

export default function UpcomingEventsCalendar({
  events,
}: {
  events: EventData[];
}) {
  if (!events?.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No upcoming events scheduled.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-amber-500' />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {events.map((event) => {
            const { month, day, time } = formatEventDate(event.eventDate);
            return (
              <div
                key={event.id}
                className='flex items-start gap-4 rounded-lg border p-3 transition-shadow hover:shadow-md'
              >
                {/* Date block */}
                <div className='flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10'>
                  <span className='text-[10px] font-semibold uppercase text-primary'>
                    {month}
                  </span>
                  <span className='text-xl font-bold leading-none'>{day}</span>
                </div>

                {/* Content */}
                <div className='min-w-0 flex-1 space-y-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <h3 className='line-clamp-1 text-sm font-semibold'>
                      {event.title}
                    </h3>
                    <Badge
                      variant={
                        event.format === 'online' ? 'default' : 'secondary'
                      }
                      className='shrink-0 text-[10px]'
                    >
                      {event.format === 'online' ? (
                        <>
                          <Globe className='mr-0.5 h-2.5 w-2.5' /> Online
                        </>
                      ) : (
                        <>
                          <MapPin className='mr-0.5 h-2.5 w-2.5' /> In-Person
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className='line-clamp-1 text-xs text-muted-foreground'>
                    {event.description}
                  </p>
                  <div className='flex items-center gap-3 text-[11px] text-muted-foreground'>
                    <span>{time}</span>
                    <span className='flex items-center gap-0.5'>
                      <Users className='h-3 w-3' />
                      {event.attendeeCount}/{event.capacity}
                    </span>
                    {event.bookCount > 0 && (
                      <span className='flex items-center gap-0.5'>
                        <BookOpen className='h-3 w-3' />
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
