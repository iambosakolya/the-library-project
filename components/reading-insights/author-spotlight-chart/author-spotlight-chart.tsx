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
import ExportChartButton from '../export-chart-button/export-chart-button';
import type { AuthorSpotlightItem } from '@/lib/actions/reading-insights.actions';
import { sharedStyles } from '../shared/styles';
import { authorSpotlightStyles as styles } from './styles';
import { COLORS } from './constants';
import { truncateText } from '../shared/utils';

export default function AuthorSpotlightChart({
  data,
}: {
  data: AuthorSpotlightItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className={sharedStyles.emptyState}>
          No author data available for this period.
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    shortAuthor: truncateText(item.author, 18),
  }));

  return (
    <Card>
      <CardHeader className={sharedStyles.cardHeader}>
        <CardTitle className={sharedStyles.headerTitle}>
          <User className={styles.headerIcon} />
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
              contentStyle={sharedStyles.tooltipContent}
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
        <div className={styles.statsGrid}>
          {data.slice(0, 6).map((author) => (
            <div key={author.author} className={styles.statsCard}>
              <p className={styles.statsAuthor}>{author.author}</p>
              <div className={styles.statsMeta}>
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
