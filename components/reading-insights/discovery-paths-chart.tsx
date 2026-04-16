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
import { Compass } from 'lucide-react';
import ExportChartButton from './export-chart-button';
import type { DiscoveryPathItem } from '@/lib/actions/reading-insights.actions';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b'];

export default function DiscoveryPathsChart({
  data,
}: {
  data: DiscoveryPathItem[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (!total) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No discovery path data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Compass className='h-5 w-5 text-cyan-500' />
          Book Discovery Paths
        </CardTitle>
        <ExportChartButton chartRef={chartRef} filename='discovery-paths' />
      </CardHeader>
      <CardContent ref={chartRef}>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={110}
              paddingAngle={3}
              dataKey='count'
              nameKey='path'
              label={({ path, percent }) =>
                `${path} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className='transition-opacity hover:opacity-80'
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: 12,
              }}
              formatter={(value: number) => [value, 'Users']}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Path breakdown */}
        <div className='mt-3 space-y-2'>
          {data.map((item, i) => (
            <div key={item.path} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full'
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className='text-sm'>{item.path}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>{item.count}</span>
                <span className='text-xs text-muted-foreground'>
                  ({total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
