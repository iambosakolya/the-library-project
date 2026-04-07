'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Video,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Event as EventType, ReadingClub } from '@/types';

/* ---------- color palettes for cards ---------- */
const colorPalettes = [
  {
    color: 'from-chart-1/30 to-chart-1/10',
    accent: 'bg-chart-1/20 text-chart-1',
  },
  {
    color: 'from-chart-2/30 to-chart-2/10',
    accent: 'bg-chart-2/20 text-chart-2',
  },
  {
    color: 'from-chart-4/30 to-chart-4/10',
    accent: 'bg-chart-4/20 text-chart-4',
  },
  {
    color: 'from-chart-3/30 to-chart-3/10',
    accent: 'bg-chart-3/20 text-chart-3',
  },
  {
    color: 'from-chart-5/30 to-chart-5/10',
    accent: 'bg-chart-5/20 text-chart-5',
  },
];

/* ---------- event card ---------- */
function EventCard({
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
      className='group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg'
    >
      {/* card header gradient */}
      <div
        className={`relative flex h-36 items-end bg-gradient-to-br ${palette.color} p-5`}
      >
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-semibold ${palette.accent}`}
        >
          {event.format === 'online' ? 'Online' : 'In-Person'}
        </span>
      </div>

      <div className='flex flex-1 flex-col p-5'>
        <Link
          href={`/events/${event.id}`}
          className='mb-3 text-lg font-bold leading-snug hover:underline'
        >
          {event.title}
        </Link>
        {event.description && (
          <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
            {event.description}
          </p>
        )}
        <div className='mt-auto space-y-2 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <CalendarDays className='h-4 w-4 shrink-0' />
            <span>{format(new Date(event.eventDate), 'PPP')}</span>
          </div>
          <div className='flex items-center gap-2'>
            {event.format === 'online' ? (
              <Video className='h-4 w-4 shrink-0' />
            ) : (
              <MapPin className='h-4 w-4 shrink-0' />
            )}
            <span>
              {event.format === 'online' ? 'Online' : event.address || 'TBA'}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Users className='h-4 w-4 shrink-0' />
            <span>
              {event.attendeeIds?.length || 0} / {event.capacity} attendees
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- club card ---------- */
function ClubCard({
  club,
  palette,
}: {
  club: ReadingClub;
  palette: (typeof colorPalettes)[number];
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.45 }}
      className='group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg'
    >
      <div
        className={`relative flex h-36 items-end bg-gradient-to-br ${palette.color} p-5`}
      >
        <div className='flex gap-2'>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${palette.accent}`}
          >
            {club.format === 'online' ? 'Online' : 'In-Person'}
          </span>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${palette.accent}`}
          >
            {club.sessionCount} sessions
          </span>
        </div>
      </div>

      <div className='flex flex-1 flex-col p-5'>
        <Link
          href={`/clubs/${club.id}`}
          className='mb-3 text-lg font-bold leading-snug hover:underline'
        >
          {club.title}
        </Link>
        {club.description && (
          <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
            {club.description}
          </p>
        )}
        <div className='mt-auto space-y-2 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <CalendarDays className='h-4 w-4 shrink-0' />
            <span>Started {format(new Date(club.startDate), 'PPP')}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Users className='h-4 w-4 shrink-0' />
            <span>
              {club.memberIds?.length || 0} / {club.capacity} members
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <BookOpen className='h-4 w-4 shrink-0' />
            <span>{club.bookIds?.length || 0} books</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   EVENTS & CLUBS PREVIEW SECTION
   ============================================================ */
export default function EventsPreviewSection({
  events = [],
  clubs = [],
}: {
  events?: EventType[];
  clubs?: ReadingClub[];
}) {
  const [tab, setTab] = useState<'events' | 'clubs'>('events');
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const perPage = 3;

  const items = tab === 'events' ? events : clubs;
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  const next = useCallback(
    () => setPage((p) => (p + 1) % totalPages),
    [totalPages],
  );
  const prev = useCallback(
    () => setPage((p) => (p - 1 + totalPages) % totalPages),
    [totalPages],
  );

  // Reset page when switching tabs
  useEffect(() => setPage(0), [tab]);

  // auto-rotate
  useEffect(() => {
    if (paused || totalPages <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, totalPages]);

  const visible = items.slice(page * perPage, page * perPage + perPage);
  const hasContent = events.length > 0 || clubs.length > 0;

  return (
    <section className='relative overflow-hidden bg-secondary/30 py-24 dark:bg-secondary/10 md:py-32'>
      <div className='relative px-6 md:px-12 xl:px-20 2xl:px-32'>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left'
        >
          <div>
            <span className='mb-3 inline-block rounded-full bg-background px-4 py-1 text-sm font-medium text-muted-foreground shadow-sm'>
              Don&apos;t miss out
            </span>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
              Upcoming{' '}
              <span className='bg-gradient-to-r from-chart-4 to-chart-2 bg-clip-text text-transparent'>
                Events & Clubs
              </span>
            </h2>
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' asChild className='group gap-2'>
              <Link href='/events'>
                View All Events
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
            <Button variant='outline' asChild className='group gap-2'>
              <Link href='/clubs'>
                View All Clubs
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* tabs */}
        {hasContent && (
          <div className='mb-8 flex justify-center gap-2'>
            <button
              onClick={() => setTab('events')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === 'events'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Events ({events.length})
            </button>
            <button
              onClick={() => setTab('clubs')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === 'clubs'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Clubs ({clubs.length})
            </button>
          </div>
        )}

        {/* cards carousel */}
        {hasContent ? (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <AnimatePresence mode='wait'>
                {visible.map((item, i) =>
                  tab === 'events' ? (
                    <EventCard
                      key={(item as EventType).id}
                      event={item as EventType}
                      palette={colorPalettes[i % colorPalettes.length]}
                    />
                  ) : (
                    <ClubCard
                      key={(item as ReadingClub).id}
                      club={item as ReadingClub}
                      palette={colorPalettes[i % colorPalettes.length]}
                    />
                  ),
                )}
              </AnimatePresence>
            </div>

            {/* dots / arrows */}
            {totalPages > 1 && (
              <div className='mt-8 flex items-center justify-center gap-4'>
                <button
                  onClick={prev}
                  className='rounded-full border bg-background p-2 transition-colors hover:bg-secondary'
                  aria-label='Previous page'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <div className='flex gap-2'>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === page
                          ? 'w-6 bg-primary'
                          : 'w-2 bg-muted-foreground/30'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className='rounded-full border bg-background p-2 transition-colors hover:bg-secondary'
                  aria-label='Next page'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className='rounded-2xl border bg-card p-12 text-center'>
            <BookOpen className='mx-auto mb-4 h-12 w-12 text-muted-foreground/30' />
            <h3 className='mb-2 text-lg font-bold'>
              No upcoming events or clubs yet
            </h3>
            <p className='text-muted-foreground'>
              Be the first to{' '}
              <Link
                href='/user/create-club-event'
                className='text-primary underline'
              >
                create one
              </Link>
              !
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
