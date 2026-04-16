'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import type { Period } from '@/components/community/period-filter';

interface ComparisonData {
  mostDiscussed: { name: string; reviewCount: number }[];
  authorSpotlight: { author: string; totalReviews: number }[];
  risingBooks: { name: string; recentReviews: number; recentSales: number }[];
}

function DeltaIndicator({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  if (previous === 0 && current === 0) {
    return <Minus className='h-3 w-3 text-muted-foreground' />;
  }
  const delta =
    previous > 0
      ? ((current - previous) / previous) * 100
      : current > 0
        ? 100
        : 0;
  if (delta > 0) {
    return (
      <span className='inline-flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400'>
        <ArrowUpRight className='h-3 w-3' />+{delta.toFixed(0)}%
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className='inline-flex items-center gap-0.5 text-xs text-red-600 dark:text-red-400'>
        <ArrowDownRight className='h-3 w-3' />
        {delta.toFixed(0)}%
      </span>
    );
  }
  return <Minus className='h-3 w-3 text-muted-foreground' />;
}

export default function PeriodComparison() {
  const [periodA, setPeriodA] = useState<Period>('month');
  const [periodB, setPeriodB] = useState<Period>('year');
  const [dataA, setDataA] = useState<ComparisonData | null>(null);
  const [dataB, setDataB] = useState<ComparisonData | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPeriod = async (period: Period): Promise<ComparisonData> => {
    const res = await fetch(
      `/api/reading-insights?section=all&period=${period}`,
    );
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const handleCompare = () => {
    startTransition(async () => {
      try {
        const [a, b] = await Promise.all([
          fetchPeriod(periodA),
          fetchPeriod(periodB),
        ]);
        setDataA(a);
        setDataB(b);
      } catch {
        // Silently handle errors
      }
    });
  };

  const periodLabel = (p: Period) =>
    p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Year';

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ArrowLeftRight className='h-5 w-5 text-blue-500' />
          Period Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className='flex flex-wrap items-center gap-3'>
          <Select
            value={periodA}
            onValueChange={(v) => setPeriodA(v as Period)}
          >
            <SelectTrigger className='h-8 w-[130px] text-xs'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='week' className='text-xs'>
                This Week
              </SelectItem>
              <SelectItem value='month' className='text-xs'>
                This Month
              </SelectItem>
              <SelectItem value='year' className='text-xs'>
                This Year
              </SelectItem>
            </SelectContent>
          </Select>

          <span className='text-sm text-muted-foreground'>vs</span>

          <Select
            value={periodB}
            onValueChange={(v) => setPeriodB(v as Period)}
          >
            <SelectTrigger className='h-8 w-[130px] text-xs'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='week' className='text-xs'>
                This Week
              </SelectItem>
              <SelectItem value='month' className='text-xs'>
                This Month
              </SelectItem>
              <SelectItem value='year' className='text-xs'>
                This Year
              </SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={handleCompare}
            disabled={isPending || periodA === periodB}
            className='rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'
          >
            {isPending ? 'Loading…' : 'Compare'}
          </button>
        </div>

        {/* Results */}
        {dataA && dataB && (
          <div className='mt-6 space-y-6'>
            {/* Top Discussed Books Comparison */}
            <div>
              <h4 className='mb-3 text-sm font-medium'>Most Discussed Books</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='mb-2 text-xs font-medium text-muted-foreground'>
                    {periodLabel(periodA)}
                  </p>
                  {dataA.mostDiscussed?.slice(0, 5).map((book) => (
                    <div
                      key={book.name}
                      className='flex items-center justify-between py-1'
                    >
                      <span className='truncate text-sm'>{book.name}</span>
                      <span className='text-xs font-medium'>
                        {book.reviewCount} reviews
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className='mb-2 text-xs font-medium text-muted-foreground'>
                    {periodLabel(periodB)}
                  </p>
                  {dataB.mostDiscussed?.slice(0, 5).map((book, i) => {
                    const prevBook = dataA.mostDiscussed?.[i];
                    return (
                      <div
                        key={book.name}
                        className='flex items-center justify-between py-1'
                      >
                        <span className='truncate text-sm'>{book.name}</span>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-medium'>
                            {book.reviewCount} reviews
                          </span>
                          {prevBook && (
                            <DeltaIndicator
                              current={book.reviewCount}
                              previous={prevBook.reviewCount}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Authors Comparison */}
            <div>
              <h4 className='mb-3 text-sm font-medium'>Top Authors</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='mb-2 text-xs font-medium text-muted-foreground'>
                    {periodLabel(periodA)}
                  </p>
                  {dataA.authorSpotlight?.slice(0, 5).map((a) => (
                    <div
                      key={a.author}
                      className='flex items-center justify-between py-1'
                    >
                      <span className='truncate text-sm'>{a.author}</span>
                      <span className='text-xs font-medium'>
                        {a.totalReviews} reviews
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className='mb-2 text-xs font-medium text-muted-foreground'>
                    {periodLabel(periodB)}
                  </p>
                  {dataB.authorSpotlight?.slice(0, 5).map((a, i) => {
                    const prevA = dataA.authorSpotlight?.[i];
                    return (
                      <div
                        key={a.author}
                        className='flex items-center justify-between py-1'
                      >
                        <span className='truncate text-sm'>{a.author}</span>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-medium'>
                            {a.totalReviews} reviews
                          </span>
                          {prevA && (
                            <DeltaIndicator
                              current={a.totalReviews}
                              previous={prevA.totalReviews}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {!dataA && !dataB && (
          <p className='mt-4 text-center text-sm text-muted-foreground'>
            Select two different periods and click Compare to see side-by-side
            analytics.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
