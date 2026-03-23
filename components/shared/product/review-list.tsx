'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StarRating from './star-rating';
import ReviewForm from './review-form';
import ReplyThread, { ReplyForm } from './reply-thread';
import ReportDialog from './report-dialog';
import UserBadges from '@/components/shared/user-badges';
import { Review } from '@/types';
import { deleteReview, voteReview } from '@/lib/actions/review.actions';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MessageSquare, Pencil, Trash2, User, ThumbsUp, ThumbsDown } from 'lucide-react';

const ReviewList = ({
  reviews,
  userId,
  productId,
}: {
  reviews: Review[];
  userId?: string;
  productId: string;
}) => {
  const userReview = userId
    ? reviews.find((r) => r.userId === userId)
    : null;
  const hasReviewed = !!userReview;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold'>
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className='mt-1 flex items-center gap-2'>
              <StarRating rating={Math.round(avgRating)} size='sm' />
              <span className='text-sm text-muted-foreground'>
                {avgRating.toFixed(1)} out of 5
              </span>
            </div>
          )}
        </div>
        {userId && !hasReviewed && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {showForm && !hasReviewed && (
        <div className='rounded-lg border p-4'>
          <h3 className='mb-3 font-semibold'>Write Your Review</h3>
          <ReviewForm
            productId={productId}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <p className='py-8 text-center text-muted-foreground'>
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}

      <div className='space-y-4'>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isOwner={userId === review.userId}
            isEditing={editingId === review.id}
            onEdit={() => setEditingId(review.id)}
            onCancelEdit={() => setEditingId(null)}
            productId={productId}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({
  review,
  isOwner,
  isEditing,
  onEdit,
  onCancelEdit,
  productId,
  userId,
}: {
  review: Review;
  isOwner: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  productId: string;
  userId?: string;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const replyCount = countReplies(review.replies ?? []);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteReview(review.id);
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        setDeleteOpen(false);
        toast({ description: res.message });
      }
    });
  };

  const handleVote = (isHelpful: boolean) => {
    if (!userId || isOwner || isVoting) return;
    setIsVoting(true);
    startTransition(async () => {
      const res = await voteReview(review.id, isHelpful);
      setIsVoting(false);
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      }
    });
  };

  if (isEditing) {
    return (
      <div className='rounded-lg border p-4'>
        <h3 className='mb-3 font-semibold'>Edit Your Review</h3>
        <ReviewForm
          productId={productId}
          existingReview={review}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className='rounded-lg border p-4'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <Link
            href={review.user ? `/profile/${review.user.id}` : '#'}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent'
          >
            <User className='h-4 w-4 text-muted-foreground' />
          </Link>
          <div>
            <div className='flex items-center gap-2'>
              <Link
                href={review.user ? `/profile/${review.user.id}` : '#'}
                className='font-medium hover:underline'
              >
                {review.user?.name ?? 'Anonymous'}
              </Link>
              {review.user?.badges && review.user.badges.length > 0 && (
                <UserBadges badges={review.user.badges} />
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatDateTime(review.createdAt).dateOnly}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-0.5'>
          {isOwner && (
            <>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8'
                onClick={onEdit}
              >
                <Pencil className='h-3.5 w-3.5' />
              </Button>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8 text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Review</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your review? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant='destructive'
                      disabled={isPending}
                      onClick={handleDelete}
                    >
                      {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {userId && !isOwner && (
            <ReportDialog reviewId={review.id} />
          )}
        </div>
      </div>

      <div className='mt-2'>
        <StarRating rating={review.rating} size='sm' />
      </div>

      <p className='mt-3 text-sm leading-relaxed'>{review.comment}</p>

      <div className='mt-3 flex items-center gap-3'>
        {/* Helpful/Not Helpful buttons */}
        {userId && !isOwner && (
          <div className='flex items-center gap-1'>
            <Button
              size='sm'
              variant={review.currentUserVote === true ? 'default' : 'ghost'}
              className='h-8 px-2 text-xs'
              onClick={() => handleVote(true)}
              disabled={isVoting}
            >
              <ThumbsUp className='mr-1 h-3.5 w-3.5' />
              Helpful
              {(review.helpfulCount ?? 0) > 0 && ` (${review.helpfulCount})`}
            </Button>
            <Button
              size='sm'
              variant={review.currentUserVote === false ? 'default' : 'ghost'}
              className='h-8 px-2 text-xs'
              onClick={() => handleVote(false)}
              disabled={isVoting}
            >
              <ThumbsDown className='mr-1 h-3.5 w-3.5' />
              Not Helpful
              {(review.notHelpfulCount ?? 0) > 0 && ` (${review.notHelpfulCount})`}
            </Button>
          </div>
        )}
        {/* Display vote counts for owner or non-logged in users */}
        {(!userId || isOwner) && ((review.helpfulCount ?? 0) > 0 || (review.notHelpfulCount ?? 0) > 0) && (
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            {(review.helpfulCount ?? 0) > 0 && (
              <span className='flex items-center gap-1'>
                <ThumbsUp className='h-3.5 w-3.5' />
                {review.helpfulCount} found helpful
              </span>
            )}
            {(review.notHelpfulCount ?? 0) > 0 && (
              <span className='flex items-center gap-1'>
                <ThumbsDown className='h-3.5 w-3.5' />
                {review.notHelpfulCount} found not helpful
              </span>
            )}
          </div>
        )}
        {userId && (
          <Button
            size='sm'
            variant='ghost'
            className='h-8 px-2 text-xs text-muted-foreground'
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <MessageSquare className='mr-1 h-3.5 w-3.5' />
            Reply
            {replyCount > 0 && ` (${replyCount})`}
          </Button>
        )}
        {!userId && replyCount > 0 && (
          <span className='flex items-center gap-1 text-xs text-muted-foreground'>
            <MessageSquare className='h-3.5 w-3.5' />
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </div>

      {showReplyForm && (
        <div className='mt-3'>
          <ReplyForm
            reviewId={review.id}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {review.replies && review.replies.length > 0 && (
        <div className='mt-4'>
          <ReplyThread
            replies={review.replies}
            reviewId={review.id}
            userId={userId}
            depth={1}
          />
        </div>
      )}
    </div>
  );
};

function countReplies(replies: Review['replies']): number {
  if (!replies) return 0;
  let count = replies.length;
  for (const reply of replies) {
    if (reply.children) {
      count += countReplies(reply.children);
    }
  }
  return count;
}

export default ReviewList;
