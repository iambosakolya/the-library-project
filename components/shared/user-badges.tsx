'use client';

import Link from 'next/link';
import { BookOpen, CalendarDays } from 'lucide-react';
import { UserBadge } from '@/types';

const UserBadges = ({ badges }: { badges: UserBadge[] }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-1'>
      {badges.map((badge) => (
        <Link
          key={`${badge.type}-${badge.id}`}
          href={badge.type === 'club' ? `/clubs/${badge.id}` : `/events/${badge.id}`}
          className='inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors hover:bg-accent'
          title={badge.title}
        >
          {badge.type === 'club' ? (
            <BookOpen className='h-2.5 w-2.5 text-emerald-600' />
          ) : (
            <CalendarDays className='h-2.5 w-2.5 text-blue-600' />
          )}
          <span className='max-w-[80px] truncate'>{badge.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default UserBadges;
