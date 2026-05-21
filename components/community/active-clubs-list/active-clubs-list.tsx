'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Library, Users, BookOpen, Globe, MapPin } from 'lucide-react';

import { ClubData } from '../shared/types';
import { activeClubsListStyles as styles } from './styles';

export default function ActiveClubsList({ clubs }: { clubs: ClubData[] }) {
  if (!clubs?.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No active clubs right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Library className={styles.headerIcon} />
          Most Active Reading Clubs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.grid}>
          {clubs.map((club) => (
            <div key={club.id} className={styles.clubCard}>
              <div className={styles.clubCardHeader}>
                <h3 className={styles.clubTitle}>{club.title}</h3>
                <Badge
                  variant={club.format === 'online' ? 'default' : 'secondary'}
                  className={styles.badge}
                >
                  {club.format === 'online' ? (
                    <>
                      <Globe className={styles.badgeIcon} /> Online
                    </>
                  ) : (
                    <>
                      <MapPin className={styles.badgeIcon} /> In-Person
                    </>
                  )}
                </Badge>
              </div>
              <p className={styles.description}>{club.description}</p>
              <div className={styles.statsRow}>
                <span className={styles.statItem}>
                  <Users className={styles.statIcon} />
                  {club.memberCount}/{club.capacity}
                </span>
                <span className={styles.statItem}>
                  <BookOpen className={styles.statIcon} />
                  {club.bookCount} books
                </span>
              </div>
              <p className={styles.creatorText}>
                Created by {club.creatorName}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
