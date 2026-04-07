import { auth } from '@/auth';
import { Metadata } from 'next';
import AnalyticsDashboard from '@/components/admin/analytics/analytics-dashboard';
import ReportHistory from '@/components/admin/analytics/report-history';

export const metadata: Metadata = {
  title: 'Analytics - Admin Dashboard',
};

const AnalyticsPage = async () => {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    throw new Error('User is not authorized');
  }

  return (
    <div className='space-y-6'>
      <h1 className='h2-bold'>Analytics & Reports</h1>
      <AnalyticsDashboard />
      <ReportHistory />
    </div>
  );
};

export default AnalyticsPage;
