'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { TrendLineChartProps } from '../shared/types';
import { tooltipContentStyle } from '../shared/constants';

export function TrendLineChart({
  data,
  xKey,
  lines,
  height = 300,
  yFormatter,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis
          dataKey={xKey}
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return new Date(v).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }
            return v;
          }}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={yFormatter}
        />
        <Tooltip contentStyle={tooltipContentStyle} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type='monotone'
            dataKey={line.key}
            stroke={line.color}
            name={line.name}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
