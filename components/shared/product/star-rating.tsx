'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({
  rating,
  onRate,
  size = 'md',
}: {
  rating: number;
  onRate?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          disabled={!onRate}
          onClick={() => onRate?.(star)}
          className={cn(
            'transition-colors',
            onRate
              ? 'cursor-pointer hover:scale-110'
              : 'cursor-default',
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300',
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
