'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, Calendar } from 'lucide-react';
import type { StreakData } from '@/lib/actions/personal-analytics.actions';

export default function StreakTracker({ data }: { data: StreakData }) {
  const streakLevel =
    data.currentStreak >= 30
      ? 'text-orange-500'
      : data.currentStreak >= 7
        ? 'text-yellow-500'
        : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Flame className='h-5 w-5 text-orange-500' />
          Reading Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center gap-8'>
          {/* Current streak */}
          <div className='text-center'>
            <div className={`text-5xl font-bold ${streakLevel}`}>
              {data.currentStreak}
            </div>
            <p className='mt-1 text-sm text-muted-foreground'>Day Streak</p>
            {data.currentStreak >= 7 && (
              <div className='mt-2 flex justify-center gap-1'>
                {Array.from({
                  length: Math.min(data.currentStreak, 7),
                }).map((_, i) => (
                  <Flame key={i} className='h-4 w-4 text-orange-400' />
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className='h-20 w-px bg-border' />

          {/* Longest streak */}
          <div className='text-center'>
            <div className='flex items-center justify-center gap-1'>
              <Trophy className='h-6 w-6 text-yellow-500' />
              <span className='text-3xl font-bold'>{data.longestStreak}</span>
            </div>
            <p className='mt-1 text-sm text-muted-foreground'>Best Streak</p>
          </div>
        </div>

        {/* Last activity */}
        {data.lastActivityDate && (
          <div className='mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground'>
            <Calendar className='h-3 w-3' />
            Last active:{' '}
            {new Date(data.lastActivityDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}

        {/* Motivational message */}
        <p className='mt-3 text-center text-sm text-muted-foreground'>
          {data.currentStreak === 0
            ? 'Start your streak today! Review a book or join an event.'
            : data.currentStreak < 7
              ? `${7 - data.currentStreak} more days until your Week Warrior badge!`
              : data.currentStreak < 30
                ? `${30 - data.currentStreak} more days until Monthly Devotion!`
                : "You're on fire! Keep the streak going!"}
        </p>
      </CardContent>
    </Card>
  );
}
