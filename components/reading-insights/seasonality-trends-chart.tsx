'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Thermometer } from 'lucide-react';
import ExportChartButton from './export-chart-button';
import type { SeasonalityItem } from '@/lib/actions/reading-insights.actions';

export default function SeasonalityTrendsChart({
  data,
}: {
  data: SeasonalityItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  const hasData = data.some((d) => d.reviews > 0 || d.purchases > 0);

  if (!hasData) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No seasonality data available yet.
        </CardContent>
      </Card>
    );
  }

  // Identify peak season
  const peakReviews = data.reduce(
    (max, d) => (d.reviews > max.reviews ? d : max),
    data[0],
  );
  const peakPurchases = data.reduce(
    (max, d) => (d.purchases > max.purchases ? d : max),
    data[0],
  );

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='flex items-center gap-2'>
            <Thermometer className='h-5 w-5 text-rose-500' />
            Seasonality Trends
          </CardTitle>
          <p className='mt-1 text-xs text-muted-foreground'>
            Peak reviews:{' '}
            <span className='font-medium'>{peakReviews.month}</span>
            {' · '}
            Peak purchases:{' '}
            <span className='font-medium'>{peakPurchases.month}</span>
          </p>
        </div>
        <ExportChartButton chartRef={chartRef} filename='seasonality-trends' />
      </CardHeader>
      <CardContent ref={chartRef}>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id='seasonReviewGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#f43f5e' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#f43f5e' stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id='seasonPurchaseGrad'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='month'
              stroke='#888888'
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type='monotone'
              dataKey='reviews'
              name='Reviews'
              stroke='#f43f5e'
              fill='url(#seasonReviewGrad)'
              strokeWidth={2}
            />
            <Area
              type='monotone'
              dataKey='purchases'
              name='Purchases'
              stroke='#3b82f6'
              fill='url(#seasonPurchaseGrad)'
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
