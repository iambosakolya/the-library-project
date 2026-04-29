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
  Cell,
} from 'recharts';
import { PenTool, Star, ThumbsUp, MessageCircle } from 'lucide-react';
import ExportChartButton from '@/components/reading-insights/export-chart-button';
import type { ReviewStats } from '@/lib/actions/personal-analytics.actions';

const RATING_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];

export default function ReviewStatsCard({ data }: { data: ReviewStats }) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <PenTool className='h-5 w-5 text-emerald-500' />
          Review Writing Statistics
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='review-stats' />
      </CardHeader>
      <CardContent>
        {/* Summary grid */}
        <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <PenTool className='mx-auto mb-1 h-5 w-5 text-indigo-500' />
            <p className='text-2xl font-bold'>{data.totalReviews}</p>
            <p className='text-xs text-muted-foreground'>Total Reviews</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <Star className='mx-auto mb-1 h-5 w-5 text-yellow-500' />
            <p className='text-2xl font-bold'>{data.averageRating}</p>
            <p className='text-xs text-muted-foreground'>Avg Rating</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <ThumbsUp className='mx-auto mb-1 h-5 w-5 text-green-500' />
            <p className='text-2xl font-bold'>{data.totalHelpfulVotes}</p>
            <p className='text-xs text-muted-foreground'>Helpful Votes</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <MessageCircle className='mx-auto mb-1 h-5 w-5 text-blue-500' />
            <p className='text-2xl font-bold'>{data.totalReplies}</p>
            <p className='text-xs text-muted-foreground'>Replies Received</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div ref={chartRef} className='h-[200px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data.ratingDistribution}>
              <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
              <XAxis
                dataKey='rating'
                fontSize={12}
                tickFormatter={(v) => `${v}★`}
              />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                }}
                formatter={(value: number) => [`${value} reviews`]}
                labelFormatter={(label) => `${label} Stars`}
              />
              <Bar dataKey='count' radius={[4, 4, 0, 0]}>
                {data.ratingDistribution.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RATING_COLORS[index % RATING_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
