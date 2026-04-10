'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GenreData {
  genre: string;
  bookCount: number;
  revenue: number;
}

const CLOUD_COLORS = [
  'text-indigo-600 dark:text-indigo-400',
  'text-violet-600 dark:text-violet-400',
  'text-pink-600 dark:text-pink-400',
  'text-rose-600 dark:text-rose-400',
  'text-amber-600 dark:text-amber-400',
  'text-emerald-600 dark:text-emerald-400',
  'text-sky-600 dark:text-sky-400',
  'text-orange-600 dark:text-orange-400',
  'text-teal-600 dark:text-teal-400',
  'text-fuchsia-600 dark:text-fuchsia-400',
];

export default function GenreCloud({ genres }: { genres: GenreData[] }) {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  if (!genres?.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No genre data available.
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...genres.map((g) => g.bookCount));
  const minSize = 0.75;
  const maxSize = 2.2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Cloud className='h-5 w-5 text-sky-500' />
          Genre Popularity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap items-center justify-center gap-3 py-4'>
          {genres.map((genre, idx) => {
            const ratio = maxCount > 0 ? genre.bookCount / maxCount : 0.5;
            const fontSize = minSize + ratio * (maxSize - minSize);
            const isHovered = hoveredGenre === genre.genre;

            return (
              <button
                key={genre.genre}
                className={cn(
                  'cursor-pointer rounded-lg px-2 py-1 font-semibold transition-all duration-200',
                  'hover:scale-110 hover:bg-accent',
                  CLOUD_COLORS[idx % CLOUD_COLORS.length],
                  isHovered && 'scale-110 bg-accent ring-2 ring-primary',
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
          <div className='text-center text-sm text-muted-foreground duration-200 animate-in fade-in-0'>
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
