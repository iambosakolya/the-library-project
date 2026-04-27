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
        <CardTitle className='flex items-center gap-2'>
          <Award className='h-5 w-5 text-yellow-500' />
          Achievements
          <span className='ml-auto text-sm font-normal text-muted-foreground'>
            {data.length} / {ALL_ACHIEVEMENTS.length} unlocked
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
          {ALL_ACHIEVEMENTS.map((achievement) => {
            const earned = earnedTypes.has(achievement.type);
            const earnedData = data.find((a) => a.type === achievement.type);

            return (
              <div
                key={achievement.type}
                className={`flex flex-col items-center rounded-lg border p-3 text-center transition-all ${
                  earned
                    ? 'border-yellow-300 bg-yellow-50 shadow-sm dark:border-yellow-700 dark:bg-yellow-950'
                    : 'border-dashed opacity-50 grayscale'
                }`}
              >
                <achievement.icon
                  className={`h-6 w-6 ${earned ? achievement.color : 'text-muted-foreground'}`}
                />
                <p
                  className={`mt-1 text-xs font-semibold ${
                    earned ? '' : 'text-muted-foreground'
                  }`}
                >
                  {achievement.title}
                </p>
                <p className='mt-0.5 text-[10px] text-muted-foreground'>
                  {achievement.description}
                </p>
                {earned && earnedData && (
                  <p className='mt-1 text-[10px] text-yellow-600 dark:text-yellow-400'>
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
