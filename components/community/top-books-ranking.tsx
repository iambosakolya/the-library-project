'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TopBook {
  rank: number;
  id: string;
  name: string;
  slug: string;
  author: string;
  image: string;
  price: number;
  rating: number;
  totalSold: number;
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-500 text-white',
  2: 'bg-gray-400 text-white',
  3: 'bg-amber-700 text-white',
};

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
        <CardContent className='py-12 text-center text-muted-foreground'>
          No sales data for this period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Trophy className='h-5 w-5 text-amber-500' />
          Top Books — {periodLabel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className='group flex items-center gap-3 rounded-lg border p-2.5 transition-all hover:bg-accent/50 hover:shadow-md'
            >
              {/* Rank */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  RANK_STYLES[book.rank] ?? 'bg-muted text-muted-foreground'
                }`}
              >
                {book.rank}
              </div>

              {/* Cover */}
              <div className='relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted'>
                <Image
                  src={book.image}
                  alt={book.name}
                  fill
                  className='object-cover'
                  sizes='36px'
                />
              </div>

              {/* Info */}
              <div className='min-w-0 flex-1'>
                <h4 className='line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary'>
                  {book.name}
                </h4>
                <p className='text-xs text-muted-foreground'>{book.author}</p>
              </div>

              {/* Stats */}
              <div className='shrink-0 text-right'>
                <Badge variant='secondary' className='text-[10px]'>
                  {book.totalSold} sold
                </Badge>
                <p className='mt-0.5 text-xs text-muted-foreground'>
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
