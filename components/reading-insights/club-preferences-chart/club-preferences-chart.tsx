'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { BookOpen } from 'lucide-react';
import ExportChartButton from '../export-chart-button/export-chart-button';
import Link from 'next/link';
import type { ClubPreferencesProps, TreemapContentProps } from '../shared/types';
import { sharedStyles } from '../shared/styles';
import { clubPreferencesStyles as styles } from './styles';
import { COLORS } from './constants';

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
        <CardContent className={sharedStyles.emptyState}>
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
      <CardHeader className={sharedStyles.cardHeader}>
        <div>
          <CardTitle className={sharedStyles.headerTitle}>
            <BookOpen className={styles.headerIcon} />
            Club Reading Preferences
          </CardTitle>
          <p className={styles.subtitle}>
            Across {data.clubCount} active clubs
          </p>
        </div>
        <ExportChartButton chartRef={chartRef} filename='club-preferences' />
      </CardHeader>
      <CardContent ref={chartRef}>
        {/* Genre treemap */}
        {treemapData.length > 0 && (
          <div className={styles.treemapWrapper}>
            <h4 className={styles.sectionTitle}>Genre Focus</h4>
            <ResponsiveContainer width='100%' height={200}>
              <Treemap
                data={treemapData}
                dataKey='value'
                nameKey='name'
                content={<CustomTreemapContent />}
              >
                <Tooltip
                  contentStyle={sharedStyles.tooltipContent}
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
            <h4 className={styles.sectionTitle}>
              Most Popular Books in Clubs
            </h4>
            <div className={styles.bookList}>
              {data.topBooks.slice(0, 8).map((book, i) => (
                <Link
                  key={book.id}
                  href={`/product/${book.slug}`}
                  className={styles.bookLink}
                >
                  <span className={styles.bookRank}>{i + 1}</span>
                  <div className={styles.bookInfo}>
                    <p className={styles.bookName}>{book.name}</p>
                    <p className={styles.bookMeta}>
                      {book.author} · {book.category}
                    </p>
                  </div>
                  <span className={styles.bookCount}>
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
