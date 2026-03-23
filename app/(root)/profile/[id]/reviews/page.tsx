import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUserReviews } from '@/lib/actions/user.actions';
import { prisma } from '@/db/prisma';
import { formatDateTime } from '@/lib/utils';
import StarRating from '@/components/shared/product/star-rating';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'All Reviews',
};

const AllReviewsPage = async (
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
  },
) => {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!user) notFound();

  const result = await getUserReviews(id, page, 10);
  if (!result.success || !result.data) notFound();

  const { data: reviews, pagination } = result;

  return (
    <div className='mx-auto max-w-4xl space-y-6 py-8'>
      <div className='flex items-center gap-3'>
        <Link href={`/profile/${id}`}>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <h1 className='text-xl font-bold'>
          All Reviews by {user.name}
          {pagination && (
            <span className='ml-2 text-base font-normal text-muted-foreground'>
              ({pagination.totalCount} total)
            </span>
          )}
        </h1>
      </div>

      {reviews.length === 0 ? (
        <p className='py-8 text-center text-muted-foreground'>
          No reviews found.
        </p>
      ) : (
        <div className='space-y-3'>
          {reviews.map(
            (review: {
              id: string;
              rating: number;
              comment: string;
              createdAt: Date;
              product: { slug: string; name: string };
            }) => (
              <div key={review.id} className='rounded-lg border p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <Link
                      href={`/product/${review.product.slug}`}
                      className='font-medium hover:underline'
                    >
                      {review.product.name}
                    </Link>
                    <div className='mt-1'>
                      <StarRating rating={review.rating} size='sm' />
                    </div>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {formatDateTime(review.createdAt).dateOnly}
                  </span>
                </div>
                <p className='mt-2 text-sm leading-relaxed'>
                  {review.comment}
                </p>
              </div>
            ),
          )}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          {page > 1 && (
            <Link
              href={`/profile/${id}/reviews?page=${page - 1}`}
            >
              <Button variant='outline' size='sm'>
                Previous
              </Button>
            </Link>
          )}
          <span className='text-sm text-muted-foreground'>
            Page {page} of {pagination.totalPages}
          </span>
          {page < pagination.totalPages && (
            <Link
              href={`/profile/${id}/reviews?page=${page + 1}`}
            >
              <Button variant='outline' size='sm'>
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AllReviewsPage;
