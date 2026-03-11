'use client';

import { useEffect, useState } from 'react';
import { getEngagementMetrics } from '@/lib/actions/organizer.actions';
import { EngagementMetrics } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  UsersIcon,
  TrendingUpIcon,
  PercentIcon,
  CalendarCheckIcon,
  UserMinusIcon,
  ActivityIcon,
} from 'lucide-react';

type Props = {
  id: string;
  type: 'club' | 'event';
};

export default function EngagementMetricsCard({ id, type }: Props) {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      const result = await getEngagementMetrics(id, type);
      if (result.success && result.data) {
        setMetrics(result.data as EngagementMetrics);
      }
      setLoading(false);
    }
    fetchMetrics();
  }, [id, type]);

  if (loading) {
    return (
      <div className='animate-pulse rounded-lg border p-4'>
        <div className='grid gap-3 sm:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-16 rounded bg-muted' />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className='rounded-lg border p-4 text-center text-sm text-muted-foreground'>
        Unable to load metrics.
      </div>
    );
  }

  const metricItems = [
    {
      label: 'Total Registrations',
      value: metrics.totalRegistrations,
      icon: UsersIcon,
      color: 'text-blue-600',
    },
    {
      label: 'Active',
      value: metrics.activeRegistrations,
      icon: TrendingUpIcon,
      color: 'text-green-600',
    },
    {
      label: 'Cancelled',
      value: metrics.cancelledRegistrations,
      icon: UserMinusIcon,
      color: 'text-red-600',
    },
    {
      label: 'Capacity Usage',
      value: `${metrics.capacityUtilization}%`,
      icon: PercentIcon,
      color: 'text-purple-600',
    },
    {
      label: 'Attendance Rate',
      value: `${metrics.attendanceRate}%`,
      icon: CalendarCheckIcon,
      color: 'text-amber-600',
    },
    {
      label: 'Sessions',
      value: `${metrics.sessionsCompleted}/${metrics.totalSessions}`,
      icon: ActivityIcon,
      color: 'text-cyan-600',
    },
  ];

  return (
    <Card className='border-dashed'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>
          Engagement Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 sm:grid-cols-3'>
          {metricItems.map((item) => (
            <div
              key={item.label}
              className='flex items-center gap-2 rounded-md bg-muted/50 p-2'
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <div>
                <p className='text-xs text-muted-foreground'>{item.label}</p>
                <p className='font-semibold'>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
