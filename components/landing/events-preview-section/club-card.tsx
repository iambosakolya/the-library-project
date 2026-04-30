'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarDays, Users, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import type { ReadingClub } from '@/types';
import { cardStyles } from './styles';
import type { colorPalettes } from './constants';

export function ClubCard({
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
      className={cardStyles.wrapper}
    >
      <div
        className={`${cardStyles.header} bg-gradient-to-br ${palette.color}`}
      >
        <div className='flex gap-2'>
          <span className={`${cardStyles.badge} ${palette.accent}`}>
            {club.format === 'online' ? 'Online' : 'In-Person'}
          </span>
          <span className={`${cardStyles.badge} ${palette.accent}`}>
            {club.sessionCount} sessions
          </span>
        </div>
      </div>

      <div className={cardStyles.body}>
        <Link href={`/clubs/${club.id}`} className={cardStyles.title}>
          {club.title}
        </Link>
        {club.description && (
          <p className={cardStyles.description}>{club.description}</p>
        )}
        <div className={cardStyles.metaWrapper}>
          <div className={cardStyles.metaRow}>
            <CalendarDays className={cardStyles.metaIcon} />
            <span>Started {format(new Date(club.startDate), 'PPP')}</span>
          </div>
          <div className={cardStyles.metaRow}>
            <Users className={cardStyles.metaIcon} />
            <span>
              {club.memberIds?.length || 0} / {club.capacity} members
            </span>
          </div>
          <div className={cardStyles.metaRow}>
            <BookOpen className={cardStyles.metaIcon} />
            <span>{club.bookIds?.length || 0} books</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
