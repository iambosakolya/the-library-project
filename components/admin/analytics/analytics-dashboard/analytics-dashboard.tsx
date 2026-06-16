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
import {
  BarChart3,
  Download,
  Loader2,
  FileJson,
  FileSpreadsheet,
  FileText,
  RefreshCw,
} from 'lucide-react';
import type { AnalyticsCategory } from '../shared/types';
import { CATEGORIES, PERIODS } from './constants';
import {
  layoutStyles,
  controlsStyles,
  progressStyles,
  exportStyles,
  tabStyles,
} from './styles';
import {
  ReadingTrendsView,
  CommunityEngagementView,
  EventsClubsView,
  UserBehaviorView,
} from './category-views';

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
    <div className={layoutStyles.wrapper}>
      {/* ── Controls ─────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className={controlsStyles.headerTitle}>
            <BarChart3 className={controlsStyles.headerIcon} />
            Analytics Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={controlsStyles.wrapper}>
            <div className={controlsStyles.group}>
              <label className={controlsStyles.label}>Category</label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as AnalyticsCategory)}
              >
                <SelectTrigger className={controlsStyles.categorySelect}>
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

            <div className={controlsStyles.group}>
              <label className={controlsStyles.label}>Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className={controlsStyles.periodSelect}>
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
                <div className={controlsStyles.group}>
                  <label className={controlsStyles.label}>Start Date</label>
                  <Input
                    type='date'
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className={controlsStyles.dateInput}
                  />
                </div>
                <div className={controlsStyles.group}>
                  <label className={controlsStyles.label}>End Date</label>
                  <Input
                    type='date'
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className={controlsStyles.dateInput}
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
            <div className={progressStyles.wrapper}>
              <div className={progressStyles.header}>
                <span>Generating report...</span>
                <span>{progress}%</span>
              </div>
              <div className={progressStyles.bar}>
                <div
                  className={progressStyles.fill}
                  style={{ width: `${progress || 10}%` }}
                />
              </div>
            </div>
          )}

          {/* Export buttons */}
          {generatedReportId && (
            <div className={exportStyles.wrapper}>
              <span className={exportStyles.label}>Export:</span>
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
          <TabsList className={tabStyles.list}>
            {CATEGORIES.map((c) => (
              <TabsTrigger
                key={c.value}
                value={c.value}
                className={tabStyles.trigger}
              >
                {c.icon}
                <span className={tabStyles.triggerLabel}>{c.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='reading_trends' className={tabStyles.content}>
            <ReadingTrendsView data={data} />
          </TabsContent>

          <TabsContent
            value='community_engagement'
            className={tabStyles.content}
          >
            <CommunityEngagementView data={data} />
          </TabsContent>

          <TabsContent value='events_clubs' className={tabStyles.content}>
            <EventsClubsView data={data} />
          </TabsContent>

          <TabsContent value='user_behavior' className={tabStyles.content}>
            <UserBehaviorView data={data} />
          </TabsContent>
        </Tabs>
      )}

      {!data && !isPending && (
        <Card>
          <CardContent className={layoutStyles.emptyState}>
            <BarChart3 className={layoutStyles.emptyIcon} />
            <p className={layoutStyles.emptyText}>
              Select a category and time period, then click &quot;Load
              Analytics&quot; to view data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
