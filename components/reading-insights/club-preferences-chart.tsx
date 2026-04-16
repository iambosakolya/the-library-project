'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { BookOpen } from 'lucide-react';
import ExportChartButton from './export-chart-button';
import Link from 'next/link';

interface ClubBook {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  image: string;
  rating: number;
  clubAppearances: number;
}

interface GenreBreakdownItem {
  genre: string;
  count: number;
}

interface ClubPreferencesProps {
  topBooks: ClubBook[];
  genreBreakdown: GenreBreakdownItem[];
  clubCount: number;
}

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
  '#06b6d4',
  '#22d3ee',
  '#67e8f9',
];

interface TreemapContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  index?: number;
}

function CustomTreemapContent({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name = '',
  index = 0,
}: TreemapContentProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={COLORS[index % COLORS.length]}
        className='transition-opacity hover:opacity-80'
        stroke='hsl(var(--card))'
        strokeWidth={2}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor='middle'
          dominantBaseline='middle'
          fill='white'
          fontSize={width > 100 ? 12 : 10}
          fontWeight={600}
        >
          {name}
        </text>
      )}
    </g>
  );
}

export default function ClubPreferencesChart({
  data,
}: {
  data: ClubPreferencesProps;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.topBooks.length && !data.genreBreakdown.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No club reading preference data available.
        </CardContent>
      </Card>
    );
  }

  const treemapData = data.genreBreakdown.map((g) => ({
    name: g.genre,
    value: g.count,
  }));

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5 text-emerald-500' />
            Club Reading Preferences
          </CardTitle>
          <p className='mt-1 text-xs text-muted-foreground'>
            Across {data.clubCount} active clubs
          </p>
        </div>
        <ExportChartButton chartRef={chartRef} filename='club-preferences' />
      </CardHeader>
      <CardContent ref={chartRef}>
        {/* Genre treemap */}
        {treemapData.length > 0 && (
          <div className='mb-6'>
            <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
              Genre Focus
            </h4>
            <ResponsiveContainer width='100%' height={200}>
              <Treemap
                data={treemapData}
                dataKey='value'
                nameKey='name'
                content={<CustomTreemapContent />}
              >
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [
                    `${value} club picks`,
                    'Count',
                  ]}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top books in clubs */}
        {data.topBooks.length > 0 && (
          <>
            <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
              Most Popular Books in Clubs
            </h4>
            <div className='space-y-2'>
              {data.topBooks.slice(0, 8).map((book, i) => (
                <Link
                  key={book.id}
                  href={`/product/${book.slug}`}
                  className='flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted'
                >
                  <span className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'>
                    {i + 1}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{book.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {book.author} · {book.category}
                    </p>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {book.clubAppearances} club
                    {book.clubAppearances !== 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
