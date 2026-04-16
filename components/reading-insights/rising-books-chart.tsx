'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import ExportChartButton from './export-chart-button';
import Link from 'next/link';
import type { RisingBook } from '@/lib/actions/reading-insights.actions';

function GrowthBadge({ percent }: { percent: number }) {
  if (percent > 0) {
    return (
      <span className='inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'>
        <ArrowUpRight className='h-3 w-3' />+{percent}%
      </span>
    );
  }
  if (percent < 0) {
    return (
      <span className='inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300'>
        <ArrowDownRight className='h-3 w-3' />
        {percent}%
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
      <Minus className='h-3 w-3' />
      0%
    </span>
  );
}

export default function RisingBooksChart({ data }: { data: RisingBook[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No rising books data available for this period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5 text-emerald-500' />
          Rising Books
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='rising-books' />
      </CardHeader>
      <CardContent ref={chartRef}>
        <div className='space-y-3'>
          {data.map((book, i) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className='flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50'
            >
              {/* Rank */}
              <span className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white'>
                {i + 1}
              </span>

              {/* Book info */}
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold'>{book.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {book.author} · {book.category}
                </p>
              </div>

              {/* Stats */}
              <div className='flex flex-shrink-0 items-center gap-3'>
                <div className='text-right'>
                  <p className='text-sm font-medium'>
                    {book.recentReviews} reviews
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {book.recentSales} sold
                  </p>
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
