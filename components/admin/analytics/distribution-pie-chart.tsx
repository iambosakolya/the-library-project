'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
];

interface DistributionPieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export function DistributionPieChart({
  data,
  height = 300,
}: DistributionPieChartProps) {
  const isCompact = height < 250;
  const outerRadius = isCompact ? 50 : 80;

  return (
    <ResponsiveContainer width='100%' height={height}>
      <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Pie
          data={data}
          cx='50%'
          cy='45%'
          labelLine
          label={({ name, percent, x, y, textAnchor }) => (
            <text
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline='central'
              fill='currentColor'
              fontSize={12}
            >
              {`${name}: ${(percent * 100).toFixed(0)}%`}
            </text>
          )}
          outerRadius={outerRadius}
          fill='#8884d8'
          dataKey='value'
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number, name: string) => [`${value}`, name]}
        />
        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='center'
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
