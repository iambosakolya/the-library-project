'use client';

import { useEffect, useState } from 'react';
import { getEngagementMetrics } from '@/lib/actions/organizer.actions';
import { EngagementMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { metricsStyles } from './styles';
import { METRIC_ITEMS } from './constants';
import { type EngagementMetricsProps } from '../shared/types';

export default function EngagementMetricsCard({
  id,
  type,
}: EngagementMetricsProps) {
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
      <div className={metricsStyles.loadingWrapper}>
        <div className={metricsStyles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={metricsStyles.loadingItem} />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={metricsStyles.errorWrapper}>Unable to load metrics.</div>
    );
  }

  return (
    <Card className='border-dashed'>
      <CardHeader className={metricsStyles.cardHeader}>
        <CardTitle className={metricsStyles.cardTitle}>
          Engagement Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={metricsStyles.grid}>
          {METRIC_ITEMS.map((item) => (
            <div key={item.label} className={metricsStyles.metricItem}>
              <item.icon
                className={`${metricsStyles.metricIcon} ${item.color}`}
              />
              <div>
                <p className={metricsStyles.metricLabel}>{item.label}</p>
                <p className={metricsStyles.metricValue}>
                  {item.getValue(metrics)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
