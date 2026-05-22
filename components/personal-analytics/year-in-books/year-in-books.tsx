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
} from 'recharts';
import {
  BookOpen,
  PenTool,
  DollarSign,
  Heart,
  Star,
  Users,
  Calendar,
} from 'lucide-react';
import ExportChartButton from '@/components/reading-insights/export-chart-button';
import type { YearInBooks } from '@/lib/actions/personal-analytics.actions';
import { yearInBooksStyles as styles } from './styles';

import { months } from './constants';

export default function YearInBooksCard({ data }: { data: YearInBooks }) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.headerTitle}>
          <BookOpen className={styles.headerIcon} />
          {data.year} Year in Books
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='year-in-books' />
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className={styles.summaryGrid}>
          <div className={styles.statPurchased}>
            <BookOpen className={`${styles.statIcon} text-indigo-500`} />
            <p className={styles.statValueIndigo}>{data.totalPurchased}</p>
            <p className={styles.statLabelIndigo}>Books Purchased</p>
          </div>
          <div className={styles.statReviewed}>
            <PenTool className={`${styles.statIcon} text-emerald-500`} />
            <p className={styles.statValueEmerald}>{data.totalReviewed}</p>
            <p className={styles.statLabelEmerald}>Reviews Written</p>
          </div>
          <div className={styles.statSpent}>
            <DollarSign className={`${styles.statIcon} text-amber-500`} />
            <p className={styles.statValueAmber}>${data.totalSpent}</p>
            <p className={styles.statLabelAmber}>Total Spent</p>
          </div>
          <div className={styles.statRating}>
            <Star className={`${styles.statIcon} text-pink-500`} />
            <p className={styles.statValuePink}>{data.averageRating}</p>
            <p className={styles.statLabelPink}>Avg Rating Given</p>
          </div>
        </div>

        {/* Additional info */}
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <Heart className='h-4 w-4 text-red-400' />
            Favorite genre: <strong>{data.favoriteGenre}</strong>
          </div>
          <div className={styles.infoItem}>
            <Users className='h-4 w-4 text-indigo-400' />
            Clubs joined: <strong>{data.clubsJoined}</strong>
          </div>
          <div className={styles.infoItem}>
            <Calendar className='h-4 w-4 text-amber-400' />
            Events attended: <strong>{data.eventsAttended}</strong>
          </div>
        </div>

        {/* Monthly activity chart */}
        <div ref={chartRef} className={styles.chartWrapper}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data.monthlyActivity}>
              <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
              <XAxis
                dataKey='month'
                fontSize={11}
                tickFormatter={(v) => {
                  const [, m] = v.split('-');
                  return months[parseInt(m) - 1] || m;
                }}
              />
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
              <Bar dataKey='purchases' fill='#6366f1' radius={[2, 2, 0, 0]} />
              <Bar dataKey='reviews' fill='#10b981' radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top books */}
        {data.topBooks.length > 0 && (
          <div className={styles.topBooksSection}>
            <h4 className={styles.topBooksTitle}>Top Rated Books</h4>
            <div className={styles.topBooksList}>
              {data.topBooks.map((book, i) => (
                <div key={book.slug} className={styles.topBookRow}>
                  <span>
                    <span className={styles.topBookRank}>#{i + 1}</span>
                    {book.name}
                  </span>
                  <span className={styles.topBookRating}>
                    {'★'.repeat(book.rating)}
                    {'☆'.repeat(5 - book.rating)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
