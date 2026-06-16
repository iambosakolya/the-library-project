'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';
import type { ParticipationItem } from '@/lib/actions/personal-analytics.actions';
import { participationHistoryStyles as styles } from './styles';

export default function ParticipationHistory({
  data,
}: {
  data: ParticipationItem[];
}) {
  if (!data.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No participation history yet. Join a club or register for an event!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Calendar className={styles.headerIcon} />
          Club & Event Participation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.list}>
          {data.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.itemLeft}>
                <div
                  className={
                    item.type === 'club' ? styles.iconClub : styles.iconEvent
                  }
                >
                  {item.type === 'club' ? (
                    <Users className={styles.typeIcon} />
                  ) : (
                    <Calendar className={styles.typeIcon} />
                  )}
                </div>
                <div>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <div className={styles.itemMeta}>
                    <Badge variant='outline' className={styles.badge}>
                      {item.type}
                    </Badge>
                    <Badge
                      variant={
                        item.role === 'organizer' ? 'default' : 'secondary'
                      }
                      className={styles.badge}
                    >
                      {item.role}
                    </Badge>
                    <span>
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.itemRight}>
                <div className={styles.statusWrapper}>
                  <Badge
                    variant={item.isActive ? 'default' : 'secondary'}
                    className={styles.badge}
                  >
                    {item.isActive ? 'Active' : 'Ended'}
                  </Badge>
                </div>
                {item.attendanceRate > 0 && (
                  <p className={styles.attendanceText}>
                    {item.attendanceRate}% attendance
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
