import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserBookSubmissions } from '@/lib/actions/book-submission.actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookPlus, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { BookSubmission } from '@/types';

export const metadata: Metadata = {
  title: 'My Book Submissions',
  description: 'View and manage your book submissions',
};

type SearchParams = {
  status?: 'pending' | 'approved' | 'rejected';
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const BookSubmissionsPage = async ({ searchParams }: PageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const status = params.status;
  const page = Number(params.page) || 1;

  const result = await getUserBookSubmissions({ page, limit: 10, status });

  if (!result.success) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p className='text-destructive'>{result.message}</p>
      </div>
    );
  }

  const { data: submissions, pagination } = result;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'approved':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'rejected':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {getStatusIcon(status)}
        <span className='ml-1 capitalize'>{status}</span>
      </Badge>
    );
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='mb-2 text-4xl font-bold'>My Book Submissions</h1>
          <p className='text-muted-foreground'>
            Track the status of your book submissions
          </p>
        </div>
        <Link href='/user/submit-book'>
          <Button>
            <BookPlus className='mr-2 h-4 w-4' />
            Submit New Book
          </Button>
        </Link>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className='py-16 text-center'>
            <BookPlus className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
            <h2 className='mb-2 text-2xl font-semibold'>No submissions yet</h2>
            <p className='mb-4 text-muted-foreground'>
              Start by submitting a book that&apos;s not in our catalog
            </p>
            <Link href='/user/submit-book'>
              <Button>
                <BookPlus className='mr-2 h-4 w-4' />
                Submit Your First Book
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {submissions.map((submission: BookSubmission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex gap-4'>
                    {submission.coverImage && (
                      <Image
                        src={submission.coverImage}
                        alt={submission.title}
                        width={80}
                        height={120}
                        className='rounded-md object-cover'
                      />
                    )}
                    <div>
                      <CardTitle className='mb-2'>{submission.title}</CardTitle>
                      <CardDescription>
                        <p className='mb-1'>
                          <span className='font-medium'>Author:</span> {submission.author}
                        </p>
                        {submission.publisher && (
                          <p className='mb-1'>
                            <span className='font-medium'>Publisher:</span> {submission.publisher}
                          </p>
                        )}
                        {submission.isbn && (
                          <p className='mb-1'>
                            <span className='font-medium'>ISBN:</span> {submission.isbn}
                          </p>
                        )}
                        <p className='mt-2 text-xs'>
                          Submitted{' '}
                          {formatDistance(new Date(submission.createdAt), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
                  {submission.description}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {submission.categories?.map((category: string) => (
                    <Badge key={category} variant='outline'>
                      {category}
                    </Badge>
                  ))}
                </div>
                {submission.status === 'rejected' && submission.rejectionReason && (
                  <div className='mt-4 rounded-md bg-destructive/10 p-3'>
                    <p className='text-sm font-medium text-destructive'>
                      Rejection Reason:
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {submission.rejectionReason}
                    </p>
                  </div>
                )}
                {submission.status === 'approved' && submission.productId && (
                  <div className='mt-4 rounded-md bg-green-500/10 p-3'>
                    <p className='text-sm font-medium text-green-700 dark:text-green-400'>
                      This book has been added to our catalog!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className='mt-8 flex justify-center gap-2'>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Link
                key={pageNum}
                href={status ? `/user/book-submissions?page=${pageNum}&status=${status}` : `/user/book-submissions?page=${pageNum}`}
              >
                <Button
                  variant={pageNum === page ? 'default' : 'outline'}
                  size='sm'
                >
                  {pageNum}
                </Button>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default BookSubmissionsPage;
