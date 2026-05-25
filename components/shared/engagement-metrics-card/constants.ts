import {
  UsersIcon,
  TrendingUpIcon,
  PercentIcon,
  CalendarCheckIcon,
  UserMinusIcon,
  ActivityIcon,
} from 'lucide-react';
import { EngagementMetrics } from '@/types';

type MetricItemConfig = {
  label: string;
  getValue: (m: EngagementMetrics) => string | number;
  icon: typeof UsersIcon;
  color: string;
};

export const METRIC_ITEMS: MetricItemConfig[] = [
  {
    label: 'Total Registrations',
    getValue: (m) => m.totalRegistrations,
    icon: UsersIcon,
    color: 'text-blue-600',
  },
  {
    label: 'Active',
    getValue: (m) => m.activeRegistrations,
    icon: TrendingUpIcon,
    color: 'text-green-600',
  },
  {
    label: 'Cancelled',
    getValue: (m) => m.cancelledRegistrations,
    icon: UserMinusIcon,
    color: 'text-red-600',
  },
  {
    label: 'Capacity Usage',
    getValue: (m) => `${m.capacityUtilization}%`,
    icon: PercentIcon,
    color: 'text-purple-600',
  },
  {
    label: 'Attendance Rate',
    getValue: (m) => `${m.attendanceRate}%`,
    icon: CalendarCheckIcon,
    color: 'text-amber-600',
  },
  {
    label: 'Sessions',
    getValue: (m) => `${m.sessionsCompleted}/${m.totalSessions}`,
    icon: ActivityIcon,
    color: 'text-cyan-600',
  },
];
