'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './star-rating';
import { useToast } from '@/hooks/use-toast';
import {
  createReview,
  updateReview,
} from '@/lib/actions/review.actions';
import { Review } from '@/types';

const ReviewForm = ({
  productId,
  existingReview,
  onCancel,
}: {
  productId: string;
  existingReview?: Review | null;
  onCancel?: () => void;
}) => {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const isEditing = !!existingReview;
  const charCount = comment.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        variant: 'destructive',
        description: 'Please select a star rating',
      });
      return;
    }

    if (charCount < 50) {
      toast({
        variant: 'destructive',
        description: `Review must be at least 50 characters (currently ${charCount})`,
      });
      return;
    }

    startTransition(async () => {
      const res = isEditing
        ? await updateReview(existingReview.id, { rating, comment })
        : await createReview({ productId, rating, comment });

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({ description: res.message });
        if (!isEditing) {
          setRating(0);
          setComment('');
        }
        onCancel?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='mb-2 block text-sm font-medium'>
          Your Rating
        </label>
        <StarRating rating={rating} onRate={setRating} size='lg' />
      </div>

      <div>
        <label className='mb-2 block text-sm font-medium'>
          Your Review
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Share your thoughts about this book (minimum 50 characters)...'
          rows={5}
          maxLength={2000}
          className='resize-none'
        />
        <p
          className={`mt-1 text-xs ${
            charCount < 50 ? 'text-muted-foreground' : 'text-green-600'
          }`}
        >
          {charCount}/2000 characters{' '}
          {charCount < 50 && `(${50 - charCount} more needed)`}
        </p>
      </div>

      <div className='flex gap-2'>
        <Button type='submit' disabled={isPending}>
          {isPending
            ? isEditing
              ? 'Updating...'
              : 'Submitting...'
            : isEditing
              ? 'Update Review'
              : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
