import { Suspense } from 'react';
import { Metadata } from 'next';
import PersonalAnalyticsClient from './personal-analytics-client';
import {
  getFullDashboardData,
  getDashboardLayout,
} from '@/lib/actions/personal-analytics.actions';

export const metadata: Metadata = {
  title: 'My Reading Dashboard',
  description:
    'Track your reading activity, set goals, view achievements, and manage your personal reading analytics.',
};

export default async function PersonalAnalyticsPage() {
  const [data, layout] = await Promise.all([
    getFullDashboardData('year'),
    getDashboardLayout(),
  ]);

  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center py-24'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary' />
        </div>
      }
    >
      <PersonalAnalyticsClient initialData={data} savedLayout={layout} />
    </Suspense>
  );
}
