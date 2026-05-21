'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { StatsData } from '../shared/types';
import { statConfig } from './constants';
import { communityStatsBarStyles as styles } from './styles';

export default function CommunityStatsBar({ data }: { data: StatsData }) {
  return (
    <div className={styles.grid}>
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <Icon className={`${styles.icon} ${color}`} />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <p className={styles.value}>{data[key]?.toLocaleString() ?? 0}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
