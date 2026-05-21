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
import { reviewStatsCardStyles as styles } from './styles';

const RATING_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];

export default function ReviewStatsCard({ data }: { data: ReviewStats }) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.headerTitle}>
          <PenTool className={styles.headerIcon} />
          Review Writing Statistics
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='review-stats' />
      </CardHeader>
      <CardContent>
        {/* Summary grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <PenTool className={`${styles.statIcon} text-indigo-500`} />
            <p className={styles.statValue}>{data.totalReviews}</p>
            <p className={styles.statLabel}>Total Reviews</p>
          </div>
          <div className={styles.statBox}>
            <Star className={`${styles.statIcon} text-yellow-500`} />
            <p className={styles.statValue}>{data.averageRating}</p>
            <p className={styles.statLabel}>Avg Rating</p>
          </div>
          <div className={styles.statBox}>
            <ThumbsUp className={`${styles.statIcon} text-green-500`} />
            <p className={styles.statValue}>{data.totalHelpfulVotes}</p>
            <p className={styles.statLabel}>Helpful Votes</p>
          </div>
          <div className={styles.statBox}>
            <MessageCircle className={`${styles.statIcon} text-blue-500`} />
            <p className={styles.statValue}>{data.totalReplies}</p>
            <p className={styles.statLabel}>Replies Received</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div ref={chartRef} className={styles.chartWrapper}>
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
