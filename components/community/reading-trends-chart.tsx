'use client';

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
import { TrendingUp } from 'lucide-react';

interface TrendsData {
  purchases: { date: string; count: number }[];
  reviews: { date: string; count: number }[];
}

export default function ReadingTrendsChart({ data }: { data: TrendsData }) {
  // Merge purchases and reviews by date
  const dateMap = new Map<
    string,
    { date: string; purchases: number; reviews: number }
  >();

  for (const p of data.purchases ?? []) {
    const existing = dateMap.get(p.date) ?? {
      date: p.date,
      purchases: 0,
      reviews: 0,
    };
    existing.purchases = p.count;
    dateMap.set(p.date, existing);
  }
  for (const r of data.reviews ?? []) {
    const existing = dateMap.get(r.date) ?? {
      date: r.date,
      purchases: 0,
      reviews: 0,
    };
    existing.reviews = r.count;
    dateMap.set(r.date, existing);
  }

  const chartData = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  if (!chartData.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No trend data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5 text-emerald-500' />
          Reading & Activity Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id='purchaseGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#6366f1' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='reviewGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#22c55e' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
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
              labelFormatter={(v) =>
                new Date(v).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type='monotone'
              dataKey='purchases'
              name='Purchases'
              stroke='#6366f1'
              fill='url(#purchaseGrad)'
              strokeWidth={2}
            />
            <Area
              type='monotone'
              dataKey='reviews'
              name='Reviews'
              stroke='#22c55e'
              fill='url(#reviewGrad)'
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
