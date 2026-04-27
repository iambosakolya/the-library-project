'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Palette } from 'lucide-react';
import ExportChartButton from '@/components/reading-insights/export-chart-button';
import type { GenrePreference } from '@/lib/actions/personal-analytics.actions';

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#f97316',
  '#ef4444',
  '#84cc16',
  '#14b8a6',
];

export default function GenreWheel({ data }: { data: GenrePreference[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No genre data available yet. Start purchasing or reviewing books!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Palette className='h-5 w-5 text-purple-500' />
          Genre Preferences
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='genre-preferences' />
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className='h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={110}
                dataKey='count'
                nameKey='genre'
                label={({ genre, percentage }) => `${genre} (${percentage}%)`}
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                }}
                formatter={(value: number, name: string) => [
                  `${value} interactions`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
