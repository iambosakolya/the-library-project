'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { CLOUD_COLORS, genreCloudStyles as styles } from './styles';
import { GenreData } from '../shared/types';

import { minSize, maxSize } from './constants';

export default function GenreCloud({ genres }: { genres: GenreData[] }) {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  if (!genres?.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No genre data available.
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...genres.map((g) => g.bookCount));

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Cloud className={styles.headerIcon} />
          Genre Popularity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.cloudWrapper}>
          {genres.map((genre, idx) => {
            const ratio = maxCount > 0 ? genre.bookCount / maxCount : 0.5;
            const fontSize = minSize + ratio * (maxSize - minSize);
            const isHovered = hoveredGenre === genre.genre;

            return (
              <button
                key={genre.genre}
                className={cn(
                  styles.genreButton,
                  styles.genreButtonHover,
                  CLOUD_COLORS[idx % CLOUD_COLORS.length],
                  isHovered && styles.genreButtonActive,
                )}
                style={{ fontSize: `${fontSize}rem` }}
                onMouseEnter={() => setHoveredGenre(genre.genre)}
                onMouseLeave={() => setHoveredGenre(null)}
                title={`${genre.genre}: ${genre.bookCount} books, $${genre.revenue.toFixed(0)} revenue`}
              >
                {genre.genre}
              </button>
            );
          })}
        </div>

        {/* Detail tooltip */}
        {hoveredGenre && (
          <div className={styles.tooltip}>
            {(() => {
              const g = genres.find((x) => x.genre === hoveredGenre);
              if (!g) return null;
              return (
                <span>
                  <strong>{g.genre}</strong>: {g.bookCount} books · $
                  {g.revenue.toLocaleString()} revenue
                </span>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
