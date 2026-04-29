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
import { User } from 'lucide-react';
import ExportChartButton from './export-chart-button';
import type { AuthorSpotlightItem } from '@/lib/actions/reading-insights.actions';

const COLORS = [
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#f59e0b',
  '#f97316',
];

export default function AuthorSpotlightChart({
  data,
}: {
  data: AuthorSpotlightItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No author data available for this period.
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    shortAuthor:
      item.author.length > 18 ? item.author.slice(0, 18) + '…' : item.author,
  }));

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5 text-violet-500' />
          Author Spotlight
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='author-spotlight' />
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
              dataKey='shortAuthor'
              type='category'
              width={140}
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
              formatter={(value: number, name: string) => {
                if (name === 'totalReviews') return [value, 'Reviews'];
                if (name === 'totalSold') return [value, 'Books Sold'];
                return [value, name];
              }}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.shortAuthor === label);
                return item
                  ? `${item.author} (${item.bookCount} books, ★ ${item.avgRating})`
                  : label;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey='totalReviews'
              name='Reviews'
              fill='#8b5cf6'
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Author stats grid */}
        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {data.slice(0, 6).map((author) => (
            <div
              key={author.author}
              className='rounded-lg border p-3 transition-colors hover:bg-muted/50'
            >
              <p className='truncate text-sm font-semibold'>{author.author}</p>
              <div className='mt-1 flex items-center gap-3 text-xs text-muted-foreground'>
                <span>{author.bookCount} books</span>
                <span>★ {author.avgRating}</span>
                <span>{author.totalReviews} reviews</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
