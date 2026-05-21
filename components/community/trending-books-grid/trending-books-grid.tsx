'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingBook } from '../shared/types';
import { trendingBooksGridStyles as styles } from './styles';

export default function TrendingBooksGrid({
  books,
}: {
  books: TrendingBook[];
}) {
  if (!books?.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No trending data available yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <TrendingUp className={styles.headerIcon} />
          Currently Trending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.grid}>
          {books.map((book, idx) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className={styles.bookCard}
            >
              {idx < 3 && <Badge className={styles.topBadge}>#{idx + 1}</Badge>}
              <div className={styles.imageWrapper}>
                <Image
                  src={book.image}
                  alt={book.name}
                  fill
                  className={styles.bookImage}
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                />
              </div>
              <h3 className={styles.bookTitle}>{book.name}</h3>
              <p className={styles.author}>{book.author}</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>${book.price.toFixed(2)}</span>
                <span className={styles.rating}>
                  {'★'.repeat(Math.round(book.rating))} ({book.numReviews})
                </span>
              </div>
              <div className={styles.badgeRow}>
                <Badge variant='secondary' className={styles.soldBadge}>
                  {book.totalSold} sold
                </Badge>
                {book.recentReviews > 0 && (
                  <Badge variant='outline' className={styles.reviewBadge}>
                    {book.recentReviews} new reviews
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
