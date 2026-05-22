'use client';

import { useRef, useState } from 'react';
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
import { BarChart3 } from 'lucide-react';
import ExportChartButton from '../export-chart-button/export-chart-button';
import type { RatingDistributionItem } from '@/lib/actions/reading-insights.actions';
import { sharedStyles } from '../shared/styles';
import { ratingDistributionStyles as styles } from './styles';
import { RATING_COLORS } from './constants';

export default function RatingDistributionChart({
  data,
}: {
  data: RatingDistributionItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className={sharedStyles.emptyState}>
          No rating data available for this period.
        </CardContent>
      </Card>
    );
  }

  const filtered = selectedGenre
    ? data.filter((d) => d.genre === selectedGenre)
    : data;

  const chartData = filtered.map((item) => ({
    genre: item.genre,
    '★ 1': item.ratings[1],
    '★ 2': item.ratings[2],
    '★ 3': item.ratings[3],
    '★ 4': item.ratings[4],
    '★ 5': item.ratings[5],
    total: item.total,
  }));

  return (
    <Card>
      <CardHeader className={sharedStyles.cardHeader}>
        <div>
          <CardTitle className={sharedStyles.headerTitle}>
            <BarChart3 className={styles.headerIcon} />
            Rating Distribution by Genre
          </CardTitle>
          {/* Genre pills */}
          <div className={styles.pillsWrapper}>
            <button
              onClick={() => setSelectedGenre(null)}
              className={
                !selectedGenre ? styles.pillActive : styles.pillInactive
              }
            >
              All
            </button>
            {data.map((d) => (
              <button
                key={d.genre}
                onClick={() =>
                  setSelectedGenre(selectedGenre === d.genre ? null : d.genre)
                }
                className={
                  selectedGenre === d.genre
                    ? styles.pillActive
                    : styles.pillInactive
                }
              >
                {d.genre}
              </button>
            ))}
          </div>
        </div>
        <ExportChartButton chartRef={chartRef} filename='rating-distribution' />
      </CardHeader>
      <CardContent ref={chartRef}>
        <ResponsiveContainer width='100%' height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='genre'
              stroke='#888888'
              fontSize={11}
              tickLine={false}
            />
            <YAxis stroke='#888888' fontSize={11} tickLine={false} />
            <Tooltip contentStyle={sharedStyles.tooltipContent} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey='★ 1' stackId='a' fill={RATING_COLORS[1]} />
            <Bar dataKey='★ 2' stackId='a' fill={RATING_COLORS[2]} />
            <Bar dataKey='★ 3' stackId='a' fill={RATING_COLORS[3]} />
            <Bar dataKey='★ 4' stackId='a' fill={RATING_COLORS[4]} />
            <Bar
              dataKey='★ 5'
              stackId='a'
              fill={RATING_COLORS[5]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
