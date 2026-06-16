export interface HeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface ActivityHeatmapProps {
  data: HeatmapCell[];
  height?: number;
}

export interface TrendLineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  lines: { key: string; color: string; name: string }[];
  height?: number;
  yFormatter?: (value: number) => string;
}

export interface ComparisonBarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; color?: string; name: string }[];
  height?: number;
  colorful?: boolean;
  yFormatter?: (value: number) => string;
}

export interface DistributionPieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export type AnalyticsCategory =
  | 'reading_trends'
  | 'community_engagement'
  | 'events_clubs'
  | 'user_behavior';

export interface Report {
  id: string;
  category: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  version: number;
  createdAt: string;
  user?: { name: string };
}
