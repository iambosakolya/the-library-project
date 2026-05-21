'use client';

import { type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Award,
  PenTool,
  FileText,
  Trophy,
  Star,
  Crown,
  BookOpen,
  Handshake,
  PartyPopper,
  Tent,
  Medal,
  Flame,
  Dumbbell,
  Zap,
  Target,
  Map,
  HeartHandshake,
} from 'lucide-react';
import type { AchievementData } from '@/lib/actions/personal-analytics.actions';
import { achievementGridStyles as styles } from './styles';

// All possible achievements for "locked" display
const ALL_ACHIEVEMENTS: {
  type: string;
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
}[] = [
  {
    type: 'first_review',
    title: 'First Words',
    icon: PenTool,
    color: 'text-indigo-500',
    description: 'Write your first review',
  },
  {
    type: 'five_reviews',
    title: 'Critic in Training',
    icon: FileText,
    color: 'text-blue-500',
    description: 'Write 5 reviews',
  },
  {
    type: 'ten_reviews',
    title: 'Seasoned Reviewer',
    icon: Trophy,
    color: 'text-amber-500',
    description: 'Write 10 reviews',
  },
  {
    type: 'twenty_five_reviews',
    title: 'Review Master',
    icon: Star,
    color: 'text-yellow-500',
    description: 'Write 25 reviews',
  },
  {
    type: 'fifty_reviews',
    title: 'Literary Sage',
    icon: Crown,
    color: 'text-purple-500',
    description: 'Write 50 reviews',
  },
  {
    type: 'first_club',
    title: 'Club Member',
    icon: BookOpen,
    color: 'text-emerald-500',
    description: 'Join your first reading club',
  },
  {
    type: 'five_clubs',
    title: 'Social Reader',
    icon: Handshake,
    color: 'text-teal-500',
    description: 'Join 5 reading clubs',
  },
  {
    type: 'first_event',
    title: 'Event Goer',
    icon: PartyPopper,
    color: 'text-pink-500',
    description: 'Attend your first event',
  },
  {
    type: 'five_events',
    title: 'Regular Attendee',
    icon: Tent,
    color: 'text-rose-500',
    description: 'Attend 5 events',
  },
  {
    type: 'ten_events',
    title: 'Event Enthusiast',
    icon: Medal,
    color: 'text-orange-500',
    description: 'Attend 10 events',
  },
  {
    type: 'streak_seven',
    title: 'Week Warrior',
    icon: Flame,
    color: 'text-red-500',
    description: '7-day reading streak',
  },
  {
    type: 'streak_thirty',
    title: 'Monthly Devotion',
    icon: Dumbbell,
    color: 'text-sky-500',
    description: '30-day streak',
  },
  {
    type: 'streak_ninety',
    title: 'Quarter Champion',
    icon: Zap,
    color: 'text-yellow-400',
    description: '90-day streak',
  },
  {
    type: 'streak_year',
    title: 'Year of Reading',
    icon: Target,
    color: 'text-red-600',
    description: '365-day streak',
  },
  {
    type: 'genre_explorer',
    title: 'Genre Explorer',
    icon: Map,
    color: 'text-cyan-500',
    description: 'Review books in 5+ genres',
  },
  {
    type: 'social_butterfly',
    title: 'Social Butterfly',
    icon: HeartHandshake,
    color: 'text-violet-500',
    description: 'Connect with 10+ readers',
  },
];

export default function AchievementGrid({ data }: { data: AchievementData[] }) {
  const earnedTypes = new Set(data.map((a) => a.type));

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Award className={styles.headerIcon} />
          Achievements
          <span className={styles.counter}>
            {data.length} / {ALL_ACHIEVEMENTS.length} unlocked
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.grid}>
          {ALL_ACHIEVEMENTS.map((achievement) => {
            const earned = earnedTypes.has(achievement.type);
            const earnedData = data.find((a) => a.type === achievement.type);

            return (
              <div
                key={achievement.type}
                className={earned ? styles.cardEarned : styles.cardLocked}
              >
                <achievement.icon
                  className={
                    earned
                      ? `${styles.icon} ${achievement.color}`
                      : styles.iconLocked
                  }
                />
                <p className={earned ? styles.title : styles.titleLocked}>
                  {achievement.title}
                </p>
                <p className={styles.description}>{achievement.description}</p>
                {earned && earnedData && (
                  <p className={styles.earnedDate}>
                    {new Date(earnedData.earnedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
