'use client';

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
import type { ComparisonBarChartProps } from '../shared/types';
import { CHART_COLORS, tooltipContentStyle } from '../shared/constants';

export function ComparisonBarChart({
  data,
  xKey,
  bars,
  height = 300,
  colorful = false,
  yFormatter,
}: ComparisonBarChartProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis
          dataKey={xKey}
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
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
        {bars.map((bar, barIdx) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color ?? CHART_COLORS[barIdx % CHART_COLORS.length]}
            radius={[4, 4, 0, 0]}
          >
            {colorful &&
              data.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
