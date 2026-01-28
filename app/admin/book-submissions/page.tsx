import { Metadata } from 'next';
import {
  getPendingBookSubmissions,
  getBookSubmissionSLAMetrics,
} from '@/lib/actions/book-submission.actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookSubmissionActions from '@/components/admin/book-submission-actions';
import { BookSubmission } from '@/types';
import Image from 'next/image';
import { Clock, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Moderate Book Submissions - Admin',
  description: 'Review and approve user-submitted books',
};

type SearchParams = {
  page?: string;
  sortBy?: 'oldest' | 'newest' | 'priority';
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AdminBookSubmissionsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sortBy = params.sortBy || 'oldest';

  const [submissionsResult, slaMetrics] = await Promise.all([
    getPendingBookSubmissions({ page, limit: 20, sortBy }),
    getBookSubmissionSLAMetrics(),
  ]);

  if (!submissionsResult.success) {
    return (
      <div className='space-y-8'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Book Submissions Moderation
        </h1>
        <p className='text-destructive'>{submissionsResult.message}</p>
      </div>
    );
  }

  const { data: submissions, pagination } = submissionsResult;
  const sla = slaMetrics.success ? slaMetrics.data : null;

  const getSLAStatus = (createdAt: Date) => {
    const now = new Date();
    const hoursSinceCreation =
      (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation < 24) {
      return {
        status: 'ontime',
        label: 'On Time',
        color: 'text-green-600',
        icon: CheckCircle,
      };
    } else if (hoursSinceCreation < 72) {
      return {
        status: 'warning',
        label: 'Attention Needed',
        color: 'text-yellow-600',
        icon: Clock,
      };
    } else {
      return {
        status: 'overdue',
        label: 'Overdue',
        color: 'text-red-600',
        icon: AlertTriangle,
      };
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Book Submissions Moderation
        </h1>
        <p className='text-muted-foreground'>
          Review and approve user-submitted books or merge with existing catalog
        </p>
      </div>

      {/* SLA Metrics */}
      {sla && (
        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Pending
              </CardTitle>
              <BookOpen className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{sla.totalPending}</div>
              <p className='text-xs text-muted-foreground'>
                Awaiting moderation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>On Time</CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {sla.onTimePending}
              </div>
              <p className='text-xs text-muted-foreground'>
                Within 3 day SLA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Recent</CardTitle>
              <Clock className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {sla.recentPending}
              </div>
              <p className='text-xs text-muted-foreground'>
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Overdue</CardTitle>
              <AlertTriangle className='h-4 w-4 text-red-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {sla.overduePending}
              </div>
              <p className='text-xs text-muted-foreground'>
                &gt;3 days old
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overdue Alert */}
      {sla && sla.overduePending > 0 && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>SLA Warning</AlertTitle>
          <AlertDescription>
            {sla.overduePending} submission{sla.overduePending > 1 ? 's' : ''}{' '}
            {sla.overduePending > 1 ? 'are' : 'is'} overdue (older than 3 days).
            Please prioritize reviewing these submissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <BookOpen className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
            <p className='text-muted-foreground'>
              No pending book submissions at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6'>
          {submissions.map((submission: BookSubmission) => {
            const slaStatus = getSLAStatus(submission.createdAt);
            const StatusIcon = slaStatus.icon;

            return (
              <Card key={submission.id} className='overflow-hidden'>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex gap-4'>
                      {submission.coverImage && (
                        <Image
                          src={submission.coverImage}
                          alt={submission.title}
                          width={100}
                          height={150}
                          className='rounded-md object-cover'
                        />
                      )}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <CardTitle>{submission.title}</CardTitle>
                          <Badge
                            variant='outline'
                            className={`flex items-center gap-1 ${slaStatus.color}`}
                          >
                            <StatusIcon className='h-3 w-3' />
                            {slaStatus.label}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className='space-y-1'>
                            <p>
                              <span className='font-medium'>Author:</span>{' '}
                              {submission.author}
                            </p>
                            <p>
                              <span className='font-medium'>Submitted by:</span>{' '}
                              {submission.user?.name} ({submission.user?.email})
                            </p>
                            <p>
                              <span className='font-medium'>Submitted:</span>{' '}
                              {formatDistance(
                                new Date(submission.createdAt),
                                new Date(),
                                { addSuffix: true },
                              )}
                            </p>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Book Details Grid */}
                  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {submission.isbn && (
                      <div>
                        <h3 className='text-sm font-semibold'>ISBN</h3>
                        <p className='text-sm text-muted-foreground'>
                          {submission.isbn}
                        </p>
                      </div>
                    )}
                    {submission.isbn13 && (
                      <div>
                        <h3 className='text-sm font-semibold'>ISBN-13</h3>
                        <p className='text-sm text-muted-foreground'>
                          {submission.isbn13}
                        </p>
                      </div>
                    )}
                    {submission.publisher && (
                      <div>
                        <h3 className='text-sm font-semibold'>Publisher</h3>
                        <p className='text-sm text-muted-foreground'>
                          {submission.publisher}
                        </p>
                      </div>
                    )}
                    {submission.publishedDate && (
                      <div>
                        <h3 className='text-sm font-semibold'>
                          Published Date
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          {submission.publishedDate}
                        </p>
                      </div>
                    )}
                    {submission.pageCount && (
                      <div>
                        <h3 className='text-sm font-semibold'>Pages</h3>
                        <p className='text-sm text-muted-foreground'>
                          {submission.pageCount}
                        </p>
                      </div>
                    )}
                    {submission.language && (
                      <div>
                        <h3 className='text-sm font-semibold'>Language</h3>
                        <p className='text-sm text-muted-foreground'>
                          {submission.language}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className='text-sm font-semibold'>Description</h3>
                    <p className='text-sm text-muted-foreground'>
                      {submission.description}
                    </p>
                  </div>

                  {/* Categories */}
                  {submission.categories && submission.categories.length > 0 && (
                    <div>
                      <h3 className='text-sm font-semibold'>Categories</h3>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {submission.categories.map((category) => (
                          <Badge key={category} variant='secondary'>
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Books Link */}
                  {submission.previewLink && (
                    <div>
                      <h3 className='text-sm font-semibold'>Preview</h3>
                      <a
                        href={submission.previewLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-primary hover:underline'
                      >
                        View on Google Books
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className='border-t pt-4'>
                    <BookSubmissionActions
                      submissionId={submission.id}
                      submissionTitle={submission.title}
                      submissionAuthor={submission.author}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='flex justify-center gap-2'>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <a
                key={pageNum}
                href={`/admin/book-submissions?page=${pageNum}${sortBy ? `&sortBy=${sortBy}` : ''}`}
                className={`rounded-md px-4 py-2 ${
                  pageNum === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {pageNum}
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}
