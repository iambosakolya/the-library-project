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
import { Activity } from 'lucide-react';
import ExportChartButton from '@/components/reading-insights/export-chart-button';
import type { TimelineItem } from '@/lib/actions/personal-analytics.actions';
import { activityTimelineStyles as styles } from './styles';

const COLORS = {
  reviews: '#6366f1',
  purchases: '#10b981',
  events: '#f59e0b',
  clubs: '#ec4899',
};

export default function ActivityTimeline({ data }: { data: TimelineItem[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No activity data available yet.
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    label: new Date(item.date + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    }),
  }));

  return (
    <Card>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.headerTitle}>
          <Activity className={styles.headerIcon} />
          Reading Activity Timeline
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='activity-timeline' />
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className={styles.chartWrapper}>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
              <XAxis dataKey='label' fontSize={12} />
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
              <Area
                type='monotone'
                dataKey='reviews'
                stroke={COLORS.reviews}
                fill={COLORS.reviews}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type='monotone'
                dataKey='purchases'
                stroke={COLORS.purchases}
                fill={COLORS.purchases}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type='monotone'
                dataKey='events'
                stroke={COLORS.events}
                fill={COLORS.events}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type='monotone'
                dataKey='clubs'
                stroke={COLORS.clubs}
                fill={COLORS.clubs}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
