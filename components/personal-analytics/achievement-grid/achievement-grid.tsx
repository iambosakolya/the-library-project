'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import type { AchievementData } from '@/lib/actions/personal-analytics.actions';
import { achievementGridStyles as styles } from './styles';
import { ALL_ACHIEVEMENTS } from './constants';

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
