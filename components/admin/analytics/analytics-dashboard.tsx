'use client';

import { useState, useCallback, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendLineChart } from '@/components/admin/analytics/trend-line-chart';
import { ComparisonBarChart } from '@/components/admin/analytics/comparison-bar-chart';
import { DistributionPieChart } from '@/components/admin/analytics/distribution-pie-chart';
import { ActivityHeatmap } from '@/components/admin/analytics/activity-heatmap';
import {
  BarChart3,
  TrendingUp,
  Users,
  CalendarDays,
  Download,
  Loader2,
  FileJson,
  FileSpreadsheet,
  FileText,
  RefreshCw,
} from 'lucide-react';

type AnalyticsCategory =
  | 'reading_trends'
  | 'community_engagement'
  | 'events_clubs'
  | 'user_behavior';

const CATEGORIES: {
  value: AnalyticsCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'reading_trends',
    label: 'Reading Trends',
    icon: <TrendingUp className='h-4 w-4' />,
  },
  {
    value: 'community_engagement',
    label: 'Community Engagement',
    icon: <Users className='h-4 w-4' />,
  },
  {
    value: 'events_clubs',
    label: 'Events & Clubs',
    icon: <CalendarDays className='h-4 w-4' />,
  },
  {
    value: 'user_behavior',
    label: 'User Behavior',
    icon: <BarChart3 className='h-4 w-4' />,
  },
];

const PERIODS = [
  { value: 'last_7', label: 'Last 7 Days' },
  { value: 'last_30', label: 'Last 30 Days' },
  { value: 'last_90', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
];

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AnalyticsDashboard() {
  const [category, setCategory] = useState<AnalyticsCategory>('reading_trends');
  const [period, setPeriod] = useState('last_30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [data, setData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [generating, setGenerating] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(
    null,
  );
  const [progress, setProgress] = useState(0);

  const fetchAnalytics = useCallback(() => {
    startTransition(async () => {
      const params = new URLSearchParams({
        category,
        period,
        ...(period === 'custom' && customStart
          ? { startDate: customStart }
          : {}),
        ...(period === 'custom' && customEnd ? { endDate: customEnd } : {}),
      });

      const res = await fetch(`/api/admin/analytics?${params}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    });
  }, [category, period, customStart, customEnd]);

  const generateReport = async () => {
    setGenerating(true);
    setProgress(0);
    setGeneratedReportId(null);

    try {
      const res = await fetch('/api/admin/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          period,
          customStart: period === 'custom' ? customStart : undefined,
          customEnd: period === 'custom' ? customEnd : undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.report) {
        setGeneratedReportId(json.report.id);
        setProgress(100);
      }
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const exportReport = (format: string) => {
    if (!generatedReportId) return;
    window.open(
      `/api/admin/analytics/export/${generatedReportId}?format=${format}`,
      '_blank',
    );
  };

  return (
    <div className='space-y-6'>
      {/* ── Controls ─────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Analytics Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap items-end gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Category</label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as AnalyticsCategory)}
              >
                <SelectTrigger className='w-[220px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className='flex items-center gap-2'>
                        {c.icon} {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {period === 'custom' && (
              <>
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium'>Start Date</label>
                  <Input
                    type='date'
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className='w-[160px]'
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium'>End Date</label>
                  <Input
                    type='date'
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className='w-[160px]'
                  />
                </div>
              </>
            )}

            <Button onClick={fetchAnalytics} disabled={isPending}>
              {isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='mr-2 h-4 w-4' />
              )}
              Load Analytics
            </Button>

            <Button
              variant='outline'
              onClick={generateReport}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Download className='mr-2 h-4 w-4' />
              )}
              Generate Report
            </Button>
          </div>

          {/* Progress bar */}
          {generating && (
            <div className='mt-4'>
              <div className='mb-1 flex justify-between text-sm text-muted-foreground'>
                <span>Generating report...</span>
                <span>{progress}%</span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-primary transition-all duration-500'
                  style={{ width: `${progress || 10}%` }}
                />
              </div>
            </div>
          )}

          {/* Export buttons */}
          {generatedReportId && (
            <div className='mt-4 flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Export:</span>
              <Button
                size='sm'
                variant='outline'
                onClick={() => exportReport('json')}
              >
                <FileJson className='mr-1 h-3 w-3' /> JSON
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => exportReport('csv')}
              >
                <FileSpreadsheet className='mr-1 h-3 w-3' /> CSV
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => exportReport('pdf')}
              >
                <FileText className='mr-1 h-3 w-3' /> PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Visualizations ───────────────────────── */}
      {data && (
        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as AnalyticsCategory)}
        >
          <TabsList className='grid w-full grid-cols-4'>
            {CATEGORIES.map((c) => (
              <TabsTrigger
                key={c.value}
                value={c.value}
                className='flex items-center gap-1'
              >
                {c.icon}
                <span className='hidden sm:inline'>{c.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='reading_trends' className='mt-4 space-y-4'>
            <ReadingTrendsView data={data} />
          </TabsContent>

          <TabsContent value='community_engagement' className='mt-4 space-y-4'>
            <CommunityEngagementView data={data} />
          </TabsContent>

          <TabsContent value='events_clubs' className='mt-4 space-y-4'>
            <EventsClubsView data={data} />
          </TabsContent>

          <TabsContent value='user_behavior' className='mt-4 space-y-4'>
            <UserBehaviorView data={data} />
          </TabsContent>
        </Tabs>
      )}

      {!data && !isPending && (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-16'>
            <BarChart3 className='mb-4 h-12 w-12 text-muted-foreground' />
            <p className='text-lg text-muted-foreground'>
              Select a category and time period, then click &quot;Load
              Analytics&quot; to view data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Category Views
   ═══════════════════════════════════════════════════════════ */

function ReadingTrendsView({ data }: { data: any }) {
  return (
    <>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.salesTrend ?? []}
              xKey='date'
              lines={[
                { key: 'orders', color: '#6366f1', name: 'Orders' },
                { key: 'revenue', color: '#22c55e', name: 'Revenue ($)' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Reviews Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.reviewsTrend ?? []}
              xKey='date'
              lines={[{ key: 'reviews', color: '#8b5cf6', name: 'Reviews' }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>
              Top Categories by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonBarChart
              data={data.topCategories ?? []}
              xKey='category'
              bars={[{ key: 'revenue', name: 'Revenue ($)', color: '#6366f1' }]}
              colorful
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.ratingDistribution ?? []).map((r: any) => ({
                name: `${r.rating} Star${r.rating !== 1 ? 's' : ''}`,
                value: r.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Top Selling Books</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={data.topBooks ?? []}
            xKey='name'
            bars={[
              { key: 'quantity', name: 'Units Sold', color: '#6366f1' },
              { key: 'revenue', name: 'Revenue ($)', color: '#22c55e' },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

function CommunityEngagementView({ data }: { data: any }) {
  return (
    <>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Reviews Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.reviewsTrend ?? []}
              xKey='date'
              lines={[{ key: 'reviews', color: '#8b5cf6', name: 'Reviews' }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Follows Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.followsTrend ?? []}
              xKey='date'
              lines={[
                { key: 'follows', color: '#ec4899', name: 'New Follows' },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.voteStats ?? []).map((v: any) => ({
                name: v.label,
                value: v.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Submissions by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.submissionsByStatus ?? []).map((s: any) => ({
                name: s.status,
                value: s.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Review Reports</CardTitle>
          </CardHeader>
          <CardContent className='flex h-[200px] flex-col items-center justify-center'>
            <p className='text-4xl font-bold'>{data.reportCount ?? 0}</p>
            <p className='mt-1 text-sm text-muted-foreground'>Total Reports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Top Reviewers</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={data.topReviewers ?? []}
            xKey='name'
            bars={[
              { key: 'reviewCount', name: 'Reviews', color: '#6366f1' },
              { key: 'avgRating', name: 'Avg Rating', color: '#f97316' },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

function EventsClubsView({ data }: { data: any }) {
  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Active Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{data.activeClubs ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{data.activeEvents ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Request Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.requestsByStatus ?? []).map((s: any) => ({
                name: s.status,
                value: s.count,
              }))}
              height={220}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Format Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.formatDistribution ?? []).map((f: any) => ({
                name: f.format,
                value: f.count,
              }))}
              height={220}
            />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Registrations Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.registrationsTrend ?? []}
              xKey='date'
              lines={[
                {
                  key: 'registrations',
                  color: '#6366f1',
                  name: 'Registrations',
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.attendanceStats ?? []).map((a: any) => ({
                name: a.status,
                value: a.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Top Clubs by Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={data.topClubs ?? []}
            xKey='title'
            bars={[{ key: 'memberCount', name: 'Members', color: '#8b5cf6' }]}
            colorful
          />
        </CardContent>
      </Card>
    </>
  );
}

function UserBehaviorView({ data }: { data: any }) {
  return (
    <>
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Cart Abandonment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {data.cartAbandonment?.abandonmentRate ?? 0}%
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              {data.cartAbandonment?.totalCarts ?? 0} carts /{' '}
              {data.cartAbandonment?.totalOrders ?? 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Buyer Types</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={[
                { name: 'Repeat', value: data.buyerTypes?.repeat ?? 0 },
                { name: 'One-time', value: data.buyerTypes?.oneTime ?? 0 },
              ]}
              height={240}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.roleDistribution ?? []).map((r: any) => ({
                name: r.role,
                value: r.count,
              }))}
              height={240}
            />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>New User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.signupsTrend ?? []}
              xKey='date'
              lines={[{ key: 'signups', color: '#22c55e', name: 'Signups' }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Top Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonBarChart
              data={data.topBuyers ?? []}
              xKey='name'
              bars={[
                {
                  key: 'totalSpent',
                  name: 'Total Spent ($)',
                  color: '#6366f1',
                },
                { key: 'orderCount', name: 'Orders', color: '#f97316' },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Order Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={data.activityHeatmap ?? []} />
        </CardContent>
      </Card>
    </>
  );
}
