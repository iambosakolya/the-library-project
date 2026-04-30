'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import type { Event as EventType, ReadingClub } from '@/types';

import { colorPalettes, CAROUSEL_INTERVAL, ITEMS_PER_PAGE } from './constants';
import { eventsPreviewStyles } from './styles';
import { EventCard } from './event-card';
import { ClubCard } from './club-card';

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

  const items = tab === 'events' ? events : clubs;
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

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
    const id = setInterval(next, CAROUSEL_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next, totalPages]);

  const visible = items.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );
  const hasContent = events.length > 0 || clubs.length > 0;

  return (
    <section className={eventsPreviewStyles.section}>
      <div className={eventsPreviewStyles.container}>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={eventsPreviewStyles.headingWrapper}
        >
          <div>
            <span className={eventsPreviewStyles.badge}>
              Don&apos;t miss out
            </span>
            <h2 className={eventsPreviewStyles.title}>
              Upcoming{' '}
              <span className={eventsPreviewStyles.gradientText}>
                Events & Clubs
              </span>
            </h2>
          </div>
          <div className={eventsPreviewStyles.buttonsRow}>
            <Button
              variant='outline'
              asChild
              className={eventsPreviewStyles.buttonLink}
            >
              <Link href='/events'>
                View All Events
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
            <Button
              variant='outline'
              asChild
              className={eventsPreviewStyles.buttonLink}
            >
              <Link href='/clubs'>
                View All Clubs
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* tabs */}
        {hasContent && (
          <div className={eventsPreviewStyles.tabsWrapper}>
            <button
              onClick={() => setTab('events')}
              className={
                tab === 'events'
                  ? eventsPreviewStyles.tabActive
                  : eventsPreviewStyles.tabInactive
              }
            >
              Events ({events.length})
            </button>
            <button
              onClick={() => setTab('clubs')}
              className={
                tab === 'clubs'
                  ? eventsPreviewStyles.tabActive
                  : eventsPreviewStyles.tabInactive
              }
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
            <div className={eventsPreviewStyles.grid}>
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
              <div className={eventsPreviewStyles.dotsWrapper}>
                <button
                  onClick={prev}
                  className={eventsPreviewStyles.navButton}
                  aria-label='Previous page'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <div className={eventsPreviewStyles.dotsInner}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={
                        i === page
                          ? eventsPreviewStyles.dotActive
                          : eventsPreviewStyles.dotInactive
                      }
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className={eventsPreviewStyles.navButton}
                  aria-label='Next page'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={eventsPreviewStyles.emptyState}>
            <BookOpen className={eventsPreviewStyles.emptyIcon} />
            <h3 className={eventsPreviewStyles.emptyTitle}>
              No upcoming events or clubs yet
            </h3>
            <p className={eventsPreviewStyles.emptyText}>
              Be the first to{' '}
              <Link
                href='/user/create-club-event'
                className={eventsPreviewStyles.emptyLink}
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
