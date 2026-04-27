'use client';

import { useState, useTransition, useCallback, lazy, Suspense } from 'react';
import type { DashboardData } from '@/lib/actions/personal-analytics.actions';
import {
  useWidgetLayout,
  WidgetCustomizer,
} from '@/components/personal-analytics/widget-customizer';
import ExportDataButton from '@/components/personal-analytics/export-data-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  BookOpen,
  PenTool,
  Flame,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

// Lazy load heavy chart/widget components
const ActivityTimeline = lazy(
  () => import('@/components/personal-analytics/activity-timeline'),
);
const GenreWheel = lazy(
  () => import('@/components/personal-analytics/genre-wheel'),
);
const ReviewStatsCard = lazy(
  () => import('@/components/personal-analytics/review-stats-card'),
);
const ParticipationHistory = lazy(
  () => import('@/components/personal-analytics/participation-history'),
);
const StreakTracker = lazy(
  () => import('@/components/personal-analytics/streak-tracker'),
);
const InteractionNetwork = lazy(
  () => import('@/components/personal-analytics/interaction-network'),
);
const YearInBooksCard = lazy(
  () => import('@/components/personal-analytics/year-in-books'),
);
const GoalTracker = lazy(
  () => import('@/components/personal-analytics/goal-tracker'),
);
const AchievementGrid = lazy(
  () => import('@/components/personal-analytics/achievement-grid'),
);
const PrivacyControls = lazy(
  () => import('@/components/personal-analytics/privacy-controls'),
);

function SectionSpinner() {
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary' />
    </div>
  );
}

export default function PersonalAnalyticsClient({
  initialData,
  savedLayout,
}: {
  initialData: DashboardData;
  savedLayout: Record<string, unknown> | null;
}) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [period, setPeriod] = useState('year');
  const [isPending, startTransition] = useTransition();

  const widgetLayout = useWidgetLayout(savedLayout);

  // Re-fetch on period change
  const handlePeriodChange = useCallback((newPeriod: string) => {
    setPeriod(newPeriod);
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/personal-analytics?section=all&period=${newPeriod}`,
        );
        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    });
  }, []);

  // Goal handlers
  const handleUpsertGoal = useCallback(async (type: string, target: number) => {
    try {
      const res = await fetch('/api/personal-analytics/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upsert-goal', type, target }),
      });
      if (res.ok) {
        // Re-fetch goals
        const goalsRes = await fetch('/api/personal-analytics?section=goals');
        if (goalsRes.ok) {
          const goals = await goalsRes.json();
          setData((prev) => ({ ...prev, goals }));
        }
      }
    } catch (error) {
      console.error('Failed to upsert goal:', error);
    }
  }, []);

  const handleDeleteGoal = useCallback(async (goalId: string) => {
    try {
      const res = await fetch('/api/personal-analytics/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-goal', goalId }),
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          goals: prev.goals.filter((g) => g.id !== goalId),
        }));
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  }, []);

  // Privacy handler
  const handleUpdatePrivacy = useCallback(
    async (key: string, value: string) => {
      try {
        const res = await fetch('/api/personal-analytics/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-privacy',
            settings: { [key]: value },
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setData((prev) => ({ ...prev, privacySettings: updated }));
        }
      } catch (error) {
        console.error('Failed to update privacy:', error);
      }
    },
    [],
  );

  // Widget renderer
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'streak':
        return <StreakTracker data={data.streak} />;
      case 'goals':
        return (
          <GoalTracker
            data={data.goals}
            onUpsert={handleUpsertGoal}
            onDelete={handleDeleteGoal}
          />
        );
      case 'timeline':
        return <ActivityTimeline data={data.timeline} />;
      case 'genres':
        return <GenreWheel data={data.genrePreferences} />;
      case 'reviews':
        return <ReviewStatsCard data={data.reviewStats} />;
      case 'yearInBooks':
        return <YearInBooksCard data={data.yearInBooks} />;
      case 'participation':
        return <ParticipationHistory data={data.participation} />;
      case 'interactions':
        return <InteractionNetwork data={data.interactionNetwork} />;
      case 'achievements':
        return <AchievementGrid data={data.achievements} />;
      case 'privacy':
        return (
          <PrivacyControls
            settings={data.privacySettings}
            onUpdate={handleUpdatePrivacy}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>
            <BarChart3 className='h-6 w-6 text-indigo-500' />
            My Reading Dashboard
          </h1>
          <p className='text-sm text-muted-foreground'>
            Track your reading journey, set goals, and celebrate achievements.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='month'>Last Month</SelectItem>
              <SelectItem value='half'>Last 6 Months</SelectItem>
              <SelectItem value='year'>Last Year</SelectItem>
            </SelectContent>
          </Select>
          <ExportDataButton />
        </div>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className='flex items-center justify-center py-4'>
          <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-primary' />
          <span className='ml-2 text-sm text-muted-foreground'>
            Updating...
          </span>
        </div>
      )}

      {/* Dashboard customizer */}
      <WidgetCustomizer {...widgetLayout} />

      {/* Summary cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <SummaryCard
          label='Books This Year'
          value={data.yearInBooks.totalPurchased}
          icon={BookOpen}
          color='text-indigo-500'
        />
        <SummaryCard
          label='Reviews Written'
          value={data.reviewStats.totalReviews}
          icon={PenTool}
          color='text-emerald-500'
        />
        <SummaryCard
          label='Day Streak'
          value={data.streak.currentStreak}
          icon={Flame}
          color='text-orange-500'
        />
        <SummaryCard
          label='Achievements'
          value={data.achievements.length}
          icon={Trophy}
          color='text-yellow-500'
        />
      </div>

      {/* Widgets in layout order */}
      <div className='space-y-6'>
        {widgetLayout.visibleWidgets.map((widget) => (
          <Suspense key={widget.id} fallback={<SectionSpinner />}>
            {renderWidget(widget.id)}
          </Suspense>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <div className='flex items-center justify-between'>
        <Icon className={`h-6 w-6 ${color}`} />
        <span className='text-2xl font-bold'>{value}</span>
      </div>
      <p className='mt-1 text-sm text-muted-foreground'>{label}</p>
    </div>
  );
}
