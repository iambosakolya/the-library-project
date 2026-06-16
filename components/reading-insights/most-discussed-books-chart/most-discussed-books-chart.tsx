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
import ExportChartButton from '../export-chart-button/export-chart-button';
import Link from 'next/link';
import type { MostDiscussedBook } from '@/lib/actions/reading-insights.actions';
import { sharedStyles } from '../shared/styles';
import { mostDiscussedBooksStyles as styles } from './styles';
import { COLORS } from './constants';
import { truncateText } from '../shared/utils';

export default function MostDiscussedBooksChart({
  data,
}: {
  data: MostDiscussedBook[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className={sharedStyles.emptyState}>
          No discussion data available for this period.
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((book) => ({
    ...book,
    shortName: truncateText(book.name, 20),
  }));

  return (
    <Card>
      <CardHeader className={sharedStyles.cardHeader}>
        <CardTitle className={sharedStyles.headerTitle}>
          <MessageSquare className={styles.headerIcon} />
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
              contentStyle={sharedStyles.tooltipContent}
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
        <div className={styles.bookGrid}>
          {data.slice(0, 6).map((book) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className={styles.bookLink}
            >
              <div className={styles.bookBadge}>{book.reviewCount}</div>
              <div className={styles.bookInfo}>
                <p className={styles.bookName}>{book.name}</p>
                <p className={styles.bookMeta}>
                  {book.author} ★ {book.avgRating}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
