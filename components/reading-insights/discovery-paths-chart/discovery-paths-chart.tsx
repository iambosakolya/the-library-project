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
import ExportChartButton from '../export-chart-button/export-chart-button';
import type { DiscoveryPathItem } from '@/lib/actions/reading-insights.actions';
import { sharedStyles } from '../shared/styles';
import { discoveryPathsStyles as styles } from './styles';
import { COLORS } from './constants';

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
        <CardContent className={sharedStyles.emptyState}>
          No discovery path data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className={sharedStyles.cardHeader}>
        <CardTitle className={sharedStyles.headerTitle}>
          <Compass className={styles.headerIcon} />
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
              contentStyle={sharedStyles.tooltipContent}
              formatter={(value: number) => [value, 'Users']}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Path breakdown */}
        <div className={styles.breakdownWrapper}>
          {data.map((item, i) => (
            <div key={item.path} className={styles.breakdownRow}>
              <div className={styles.breakdownLabel}>
                <div
                  className={styles.breakdownDot}
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className={styles.breakdownText}>{item.path}</span>
              </div>
              <div className={styles.breakdownValue}>
                <span className={styles.breakdownCount}>{item.count}</span>
                <span className={styles.breakdownPercent}>
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
