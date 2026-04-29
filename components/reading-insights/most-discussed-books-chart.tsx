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
  Cell,
} from 'recharts';
import { MessageSquare } from 'lucide-react';
import ExportChartButton from './export-chart-button';
import Link from 'next/link';
import type { MostDiscussedBook } from '@/lib/actions/reading-insights.actions';

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#7c3aed',
  '#4f46e5',
  '#818cf8',
  '#6d28d9',
  '#5b21b6',
  '#4338ca',
];

export default function MostDiscussedBooksChart({
  data,
}: {
  data: MostDiscussedBook[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No discussion data available for this period.
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((book) => ({
    ...book,
    shortName: book.name.length > 20 ? book.name.slice(0, 20) + '…' : book.name,
  }));

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='h-5 w-5 text-indigo-500' />
          Most Discussed Books
        </CardTitle>
        <ExportChartButton
          chartRef={chartRef}
          filename='most-discussed-books'
        />
      </CardHeader>
      <CardContent ref={chartRef}>
        <ResponsiveContainer width='100%' height={360}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
            layout='vertical'
          >
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis type='number' stroke='#888888' fontSize={11} />
            <YAxis
              dataKey='shortName'
              type='category'
              width={150}
              stroke='#888888'
              fontSize={11}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => [
                value,
                name === 'reviewCount'
                  ? 'Reviews'
                  : name === 'totalSold'
                    ? 'Sold'
                    : name,
              ]}
              labelFormatter={(label) => {
                const book = chartData.find((b) => b.shortName === label);
                return book ? `${book.name} by ${book.author}` : label;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey='reviewCount'
              name='Reviews'
              fill='#6366f1'
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Book list below chart */}
        <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {data.slice(0, 6).map((book) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className='flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'>
                {book.reviewCount}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{book.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {book.author} · ★ {book.avgRating}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
