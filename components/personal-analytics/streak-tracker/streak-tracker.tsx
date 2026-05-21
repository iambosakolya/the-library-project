'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, Calendar } from 'lucide-react';
import type { StreakData } from '@/lib/actions/personal-analytics.actions';
import { streakTrackerStyles as styles } from './styles';

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
        <CardTitle className={styles.headerTitle}>
          <Flame className={styles.headerIcon} />
          Reading Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.content}>
          {/* Current streak */}
          <div className={styles.currentStreak}>
            <div className={`${styles.streakValue} ${streakLevel}`}>
              {data.currentStreak}
            </div>
            <p className={styles.streakLabel}>Day Streak</p>
            {data.currentStreak >= 7 && (
              <div className={styles.flameRow}>
                {Array.from({
                  length: Math.min(data.currentStreak, 7),
                }).map((_, i) => (
                  <Flame key={i} className={styles.flameIcon} />
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Longest streak */}
          <div className={styles.bestStreak}>
            <div className={styles.bestStreakRow}>
              <Trophy className={styles.trophyIcon} />
              <span className={styles.bestStreakValue}>
                {data.longestStreak}
              </span>
            </div>
            <p className={styles.bestStreakLabel}>Best Streak</p>
          </div>
        </div>

        {/* Last activity */}
        {data.lastActivityDate && (
          <div className={styles.lastActivity}>
            <Calendar className={styles.lastActivityIcon} />
            Last active:{' '}
            {new Date(data.lastActivityDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}

        {/* Motivational message */}
        <p className={styles.motivationalText}>
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
