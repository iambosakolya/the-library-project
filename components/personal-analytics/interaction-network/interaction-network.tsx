'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, UserCircle } from 'lucide-react';
import Image from 'next/image';
import type { InteractionUser } from '@/lib/actions/personal-analytics.actions';
import { interactionNetworkStyles as styles } from './styles';

const TYPE_LABELS: Record<string, string> = {
  review_reply: 'Review interactions',
  club_member: 'Club co-member',
  follower: 'Follower/Following',
};

const TYPE_COLORS: Record<string, string> = {
  review_reply:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  club_member:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  follower: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
};

export default function InteractionNetwork({
  data,
}: {
  data: InteractionUser[];
}) {
  if (!data.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No interactions yet. Engage with the community to build your network!
        </CardContent>
      </Card>
    );
  }

  const maxInteractions = Math.max(...data.map((d) => d.interactions));

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Network className={styles.headerIcon} />
          Interaction Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.list}>
          {data.slice(0, 10).map((user) => (
            <div key={user.id} className={styles.userRow}>
              <div className={styles.avatarWrapper}>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={32}
                    height={32}
                    className={styles.avatarImage}
                  />
                ) : (
                  <UserCircle className={styles.avatarFallback} />
                )}
              </div>
              <div className={styles.userContent}>
                <div className={styles.userHeader}>
                  <p className={styles.userName}>{user.name}</p>
                  <span
                    className={`${styles.typeBadge} ${TYPE_COLORS[user.type] || ''}`}
                  >
                    {TYPE_LABELS[user.type] || user.type}
                  </span>
                </div>
                <div className={styles.progressWrapper}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: `${(user.interactions / maxInteractions) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className={styles.interactionCount}>
                {user.interactions}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
