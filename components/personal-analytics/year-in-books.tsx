'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BookOpen,
  PenTool,
  DollarSign,
  Heart,
  Star,
  Users,
  Calendar,
} from 'lucide-react';
import ExportChartButton from '@/components/reading-insights/export-chart-button';
import type { YearInBooks } from '@/lib/actions/personal-analytics.actions';

export default function YearInBooksCard({ data }: { data: YearInBooks }) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <BookOpen className='h-5 w-5 text-violet-500' />
          {data.year} Year in Books
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='year-in-books' />
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className='mb-6 grid grid-cols-2 gap-3 md:grid-cols-4'>
          <div className='rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 text-center dark:from-indigo-950 dark:to-indigo-900'>
            <BookOpen className='mx-auto mb-1 h-5 w-5 text-indigo-500' />
            <p className='text-2xl font-bold text-indigo-700 dark:text-indigo-300'>
              {data.totalPurchased}
            </p>
            <p className='text-xs text-indigo-600/70 dark:text-indigo-400/70'>
              Books Purchased
            </p>
          </div>
          <div className='rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 text-center dark:from-emerald-950 dark:to-emerald-900'>
            <PenTool className='mx-auto mb-1 h-5 w-5 text-emerald-500' />
            <p className='text-2xl font-bold text-emerald-700 dark:text-emerald-300'>
              {data.totalReviewed}
            </p>
            <p className='text-xs text-emerald-600/70 dark:text-emerald-400/70'>
              Reviews Written
            </p>
          </div>
          <div className='rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-3 text-center dark:from-amber-950 dark:to-amber-900'>
            <DollarSign className='mx-auto mb-1 h-5 w-5 text-amber-500' />
            <p className='text-2xl font-bold text-amber-700 dark:text-amber-300'>
              ${data.totalSpent}
            </p>
            <p className='text-xs text-amber-600/70 dark:text-amber-400/70'>
              Total Spent
            </p>
          </div>
          <div className='rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 p-3 text-center dark:from-pink-950 dark:to-pink-900'>
            <Star className='mx-auto mb-1 h-5 w-5 text-pink-500' />
            <p className='text-2xl font-bold text-pink-700 dark:text-pink-300'>
              {data.averageRating}
            </p>
            <p className='text-xs text-pink-600/70 dark:text-pink-400/70'>
              Avg Rating Given
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className='mb-6 flex flex-wrap items-center justify-center gap-4 text-sm'>
          <div className='flex items-center gap-1 text-muted-foreground'>
            <Heart className='h-4 w-4 text-red-400' />
            Favorite genre: <strong>{data.favoriteGenre}</strong>
          </div>
          <div className='flex items-center gap-1 text-muted-foreground'>
            <Users className='h-4 w-4 text-indigo-400' />
            Clubs joined: <strong>{data.clubsJoined}</strong>
          </div>
          <div className='flex items-center gap-1 text-muted-foreground'>
            <Calendar className='h-4 w-4 text-amber-400' />
            Events attended: <strong>{data.eventsAttended}</strong>
          </div>
        </div>

        {/* Monthly activity chart */}
        <div ref={chartRef} className='h-[200px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data.monthlyActivity}>
              <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
              <XAxis
                dataKey='month'
                fontSize={11}
                tickFormatter={(v) => {
                  const [, m] = v.split('-');
                  const months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ];
                  return months[parseInt(m) - 1] || m;
                }}
              />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                }}
              />
              <Legend />
              <Bar dataKey='purchases' fill='#6366f1' radius={[2, 2, 0, 0]} />
              <Bar dataKey='reviews' fill='#10b981' radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top books */}
        {data.topBooks.length > 0 && (
          <div className='mt-6'>
            <h4 className='mb-2 text-sm font-semibold'>Top Rated Books</h4>
            <div className='space-y-1'>
              {data.topBooks.map((book, i) => (
                <div
                  key={book.slug}
                  className='flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-muted/50'
                >
                  <span>
                    <span className='mr-2 text-muted-foreground'>#{i + 1}</span>
                    {book.name}
                  </span>
                  <span className='text-yellow-500'>
                    {'★'.repeat(book.rating)}
                    {'☆'.repeat(5 - book.rating)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
