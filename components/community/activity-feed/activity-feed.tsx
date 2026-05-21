'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from 'lucide-react';
import { colorMap, iconMap } from '../shared/styles';
import { badgeVariantMap, activityFeedStyles as styles } from './styles';

import { timeAgo } from './utils';
import { ActivityItem } from '../shared/types';

export default function ActivityFeed({ data }: { data: ActivityItem[] }) {
  if (!data?.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No recent activity.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Activity className={styles.headerIcon} />
          Community Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={styles.scrollArea}>
          <div className={styles.feedList}>
            {data.map((item, i) => {
              const Icon = iconMap[item.type] ?? Activity;
              const color = colorMap[item.type] ?? 'text-muted-foreground';
              return (
                <div key={`${item.type}-${i}`} className={styles.feedItem}>
                  <div className={`${styles.itemIconWrapper} ${color}`}>
                    <Icon className={styles.itemIcon} />
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <p className={styles.itemDescription}>{item.description}</p>
                  </div>
                  <div className={styles.itemMeta}>
                    <Badge
                      variant={badgeVariantMap[item.type] ?? 'default'}
                      className={styles.badge}
                    >
                      {item.type}
                    </Badge>
                    <span className={styles.timeText}>
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
