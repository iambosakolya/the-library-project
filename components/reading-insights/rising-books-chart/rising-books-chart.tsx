'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import ExportChartButton from '../export-chart-button/export-chart-button';
import Link from 'next/link';
import type { RisingBook } from '@/lib/actions/reading-insights.actions';
import { sharedStyles } from '../shared/styles';
import { risingBooksStyles as styles } from './styles';
import { GrowthBadge } from './growth-badge';

export default function RisingBooksChart({ data }: { data: RisingBook[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className={sharedStyles.emptyState}>
          No rising books data available for this period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className={sharedStyles.cardHeader}>
        <CardTitle className={sharedStyles.headerTitle}>
          <TrendingUp className={styles.headerIcon} />
          Rising Books
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='rising-books' />
      </CardHeader>
      <CardContent ref={chartRef}>
        <div className={styles.bookList}>
          {data.map((book, i) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className={styles.bookLink}
            >
              {/* Rank */}
              <span className={styles.bookRank}>{i + 1}</span>

              {/* Book info */}
              <div className={styles.bookInfo}>
                <p className={styles.bookName}>{book.name}</p>
                <p className={styles.bookMeta}>
                  {book.author} · {book.category}
                </p>
              </div>

              {/* Stats */}
              <div className={styles.statsWrapper}>
                <div className={styles.statsValues}>
                  <p className={styles.statsReviews}>
                    {book.recentReviews} reviews
                  </p>
                  <p className={styles.statsSold}>{book.recentSales} sold</p>
                </div>
                <GrowthBadge percent={book.growthPercent} />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
