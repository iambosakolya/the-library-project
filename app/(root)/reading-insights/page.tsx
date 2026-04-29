import { Suspense } from 'react';
import { Metadata } from 'next';
import ReadingInsightsClient from './reading-insights-client';
import { getReadingInsightsData } from '@/lib/actions/reading-insights.actions';
import { prisma } from '@/db/prisma';

export const metadata: Metadata = {
  title: 'Reading Insights',
  description:
    'Explore reading trends, most discussed books, popular authors, seasonal patterns, and discovery paths in our community.',
};

export default async function ReadingInsightsPage() {
  // Parallel fetch: insights data + genre list
  const [data, categories] = await Promise.all([
    getReadingInsightsData('month'),
    prisma.product
      .findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      })
      .then((rows) => rows.map((r) => r.category)),
  ]);

  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center py-24'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary' />
        </div>
      }
    >
      <ReadingInsightsClient initialData={data} genres={categories} />
    </Suspense>
  );
}
