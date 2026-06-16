'use client';

import Link from 'next/link';
import { BookOpen, CalendarDays } from 'lucide-react';
import { UserBadge } from '@/types';
import { badgeStyles } from './styles';

const UserBadges = ({ badges }: { badges: UserBadge[] }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={badgeStyles.wrapper}>
      {badges.map((badge) => (
        <Link
          key={`${badge.type}-${badge.id}`}
          href={
            badge.type === 'club' ? `/clubs/${badge.id}` : `/events/${badge.id}`
          }
          className={badgeStyles.link}
          title={badge.title}
        >
          {badge.type === 'club' ? (
            <BookOpen className={badgeStyles.clubIcon} />
          ) : (
            <CalendarDays className={badgeStyles.eventIcon} />
          )}
          <span className={badgeStyles.text}>{badge.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default UserBadges;
