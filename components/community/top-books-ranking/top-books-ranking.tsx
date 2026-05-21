'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { TopBook } from '../shared/types';
import { RANK_STYLES, topBooksRankingStyles as styles } from './styles';

export default function TopBooksRanking({
  books,
  period,
}: {
  books: TopBook[];
  period: string;
}) {
  const periodLabel =
    period === 'week'
      ? 'This Week'
      : period === 'year'
        ? 'This Year'
        : 'This Month';

  if (!books?.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No sales data for this period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Trophy className={styles.headerIcon} />
          Top Books — {periodLabel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.list}>
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className={styles.bookLink}
            >
              {/* Rank */}
              <div
                className={`${styles.rankBadge} ${
                  RANK_STYLES[book.rank] ?? styles.rankDefault
                }`}
              >
                {book.rank}
              </div>

              {/* Cover */}
              <div className={styles.coverWrapper}>
                <Image
                  src={book.image}
                  alt={book.name}
                  fill
                  className={styles.coverImage}
                  sizes='36px'
                />
              </div>

              {/* Info */}
              <div className={styles.infoWrapper}>
                <h4 className={styles.bookTitle}>{book.name}</h4>
                <p className={styles.author}>{book.author}</p>
              </div>

              {/* Stats */}
              <div className={styles.statsWrapper}>
                <Badge variant='secondary' className={styles.salesBadge}>
                  {book.totalSold} sold
                </Badge>
                <p className={styles.ratingText}>
                  {'★'.repeat(Math.round(book.rating))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
