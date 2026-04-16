'use client';

import { useState, useTransition, useCallback, lazy, Suspense } from 'react';
import PeriodFilter, {
  type Period,
} from '@/components/community/period-filter';
import GenreFilter from '@/components/reading-insights/genre-filter';
import type { ReadingInsightsData } from '@/lib/actions/reading-insights.actions';

// Lazy load heavy chart components
const MostDiscussedBooksChart = lazy(
  () => import('@/components/reading-insights/most-discussed-books-chart'),
);
const RatingDistributionChart = lazy(
  () => import('@/components/reading-insights/rating-distribution-chart'),
);
const AuthorSpotlightChart = lazy(
  () => import('@/components/reading-insights/author-spotlight-chart'),
);
const SeasonalityTrendsChart = lazy(
  () => import('@/components/reading-insights/seasonality-trends-chart'),
);
const DiscoveryPathsChart = lazy(
  () => import('@/components/reading-insights/discovery-paths-chart'),
);
const ClubPreferencesChart = lazy(
  () => import('@/components/reading-insights/club-preferences-chart'),
);
const RisingBooksChart = lazy(
  () => import('@/components/reading-insights/rising-books-chart'),
);
const PeriodComparison = lazy(
  () => import('@/components/reading-insights/period-comparison'),
);

function SectionSpinner() {
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary' />
    </div>
  );
}

export default function ReadingInsightsClient({
  initialData,
  genres,
}: {
  initialData: ReadingInsightsData;
  genres: string[];
}) {
  const [data, setData] = useState(initialData);
  const [period, setPeriod] = useState<Period>('month');
  const [genre, setGenre] = useState('all');
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback((newPeriod: Period, newGenre: string) => {
    startTransition(async () => {
      try {
        const genreParam =
          newGenre !== 'all' ? `&genre=${encodeURIComponent(newGenre)}` : '';
        const res = await fetch(
          `/api/reading-insights?section=all&period=${newPeriod}${genreParam}`,
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch {
        // Keep current data on failure
      }
    });
  }, []);

  const handlePeriodChange = useCallback(
    (p: Period) => {
      setPeriod(p);
      fetchData(p, genre);
    },
    [genre, fetchData],
  );

  const handleGenreChange = useCallback(
    (g: string) => {
      setGenre(g);
      fetchData(period, g);
    },
    [period, fetchData],
  );

  return (
    <div className='space-y-6 py-4'>
      {/* Header */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Reading Insights
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Discover reading trends, popular authors, and community patterns.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <PeriodFilter value={period} onChange={handlePeriodChange} />
          <GenreFilter
            genres={genres}
            value={genre}
            onChange={handleGenreChange}
          />
          {isPending && (
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-primary' />
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <SummaryCard
          label='Discussed Books'
          value={data.mostDiscussed.length}
          color='indigo'
        />
        <SummaryCard
          label='Active Authors'
          value={data.authorSpotlight.length}
          color='violet'
        />
        <SummaryCard
          label='Rising Books'
          value={data.risingBooks.length}
          color='emerald'
        />
        <SummaryCard
          label='Club Books'
          value={data.clubPreferences?.topBooks?.length ?? 0}
          color='cyan'
        />
      </div>

      {/* Row 1: Most Discussed + Rising Books */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Suspense fallback={<SectionSpinner />}>
          <MostDiscussedBooksChart data={data.mostDiscussed} />
        </Suspense>
        <Suspense fallback={<SectionSpinner />}>
          <RisingBooksChart data={data.risingBooks} />
        </Suspense>
      </div>

      {/* Row 2: Rating Distribution */}
      <Suspense fallback={<SectionSpinner />}>
        <RatingDistributionChart data={data.ratingDistribution} />
      </Suspense>

      {/* Row 3: Author Spotlight + Seasonality */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Suspense fallback={<SectionSpinner />}>
          <AuthorSpotlightChart data={data.authorSpotlight} />
        </Suspense>
        <Suspense fallback={<SectionSpinner />}>
          <SeasonalityTrendsChart data={data.seasonality} />
        </Suspense>
      </div>

      {/* Row 4: Discovery Paths + Club Preferences */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Suspense fallback={<SectionSpinner />}>
          <DiscoveryPathsChart data={data.discoveryPaths} />
        </Suspense>
        <Suspense fallback={<SectionSpinner />}>
          <ClubPreferencesChart data={data.clubPreferences} />
        </Suspense>
      </div>

      {/* Row 5: Period Comparison */}
      <Suspense fallback={<SectionSpinner />}>
        <PeriodComparison />
      </Suspense>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-600',
    violet: 'from-violet-500 to-violet-600',
    emerald: 'from-emerald-500 to-emerald-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <div className='rounded-xl border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='mt-1 text-2xl font-bold'>
        <span
          className={`bg-gradient-to-r ${colorMap[color] ?? colorMap.indigo} bg-clip-text text-transparent`}
        >
          {value}
        </span>
      </p>
    </div>
  );
}
