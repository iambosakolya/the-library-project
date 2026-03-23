'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, ThumbsUp, ThumbsDown, Sparkles, Loader2 } from 'lucide-react';
import { getReviewSummary } from '@/lib/actions/review-summary.actions';

interface Summary {
  sentiment: string;
  positiveAspects: string[];
  negativeAspects: string[];
  themes: string[];
  summaryText: string;
  reviewCount: number;
  generatedAt: Date | string;
}

const SENTIMENT_CONFIG = {
  positive: {
    label: 'Mostly Positive',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  negative: {
    label: 'Mostly Negative',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  mixed: {
    label: 'Mixed',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
} as const;

const MIN_REVIEWS = 10;

const ReviewSummary = ({
  productId,
  numReviews,
}: {
  productId: string;
  numReviews: number;
}) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (numReviews < MIN_REVIEWS) return null;

  const handleClick = () => {
    if (summary) {
      setVisible((v) => !v);
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await getReviewSummary(productId);
      if (result.success && result.data) {
        setSummary(result.data);
        setVisible(true);
      } else {
        setError(result.message ?? 'Failed to generate summary');
      }
    });
  };

  const sentimentKey = summary?.sentiment as keyof typeof SENTIMENT_CONFIG;
  const sentiment = sentimentKey
    ? (SENTIMENT_CONFIG[sentimentKey] ?? SENTIMENT_CONFIG.mixed)
    : null;

  return (
    <div className='space-y-3'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleClick}
        disabled={isPending}
        className='gap-2'
      >
        {isPending ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Sparkles className='h-4 w-4' />
        )}
        {isPending
          ? 'Generating summary...'
          : visible
            ? 'Hide AI Summary'
            : 'View AI Summary'}
      </Button>

      {error && (
        <p className='text-sm text-destructive'>{error}</p>
      )}

      {visible && summary && sentiment && (
        <Card className='border-dashed'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Sparkles className='h-4 w-4 text-primary' />
                AI-Generated Review Summary
              </CardTitle>
              <Badge variant='outline' className={sentiment.className}>
                {sentiment.label}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground'>
              Based on {summary.reviewCount} reviews &middot; Last updated{' '}
              {formatDateTime(summary.generatedAt).dateOnly}
            </p>
          </CardHeader>

          <CardContent className='space-y-4'>
            <p className='text-sm leading-relaxed'>{summary.summaryText}</p>

            <div className='grid gap-4 sm:grid-cols-2'>
              {summary.positiveAspects.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400'>
                    <ThumbsUp className='h-3.5 w-3.5' />
                    What readers liked
                  </h4>
                  <ul className='space-y-1'>
                    {summary.positiveAspects.map((aspect) => (
                      <li
                        key={aspect}
                        className='text-sm text-muted-foreground'
                      >
                        &bull; {aspect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.negativeAspects.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='flex items-center gap-1.5 text-sm font-medium text-red-700 dark:text-red-400'>
                    <ThumbsDown className='h-3.5 w-3.5' />
                    What readers disliked
                  </h4>
                  <ul className='space-y-1'>
                    {summary.negativeAspects.map((aspect) => (
                      <li
                        key={aspect}
                        className='text-sm text-muted-foreground'
                      >
                        &bull; {aspect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {summary.themes.length > 0 && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Key Themes</h4>
                <div className='flex flex-wrap gap-1.5'>
                  {summary.themes.map((theme) => (
                    <Badge key={theme} variant='secondary' className='text-xs'>
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className='flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground'>
              <Bot className='h-3.5 w-3.5' />
              This summary was generated by AI and may not perfectly reflect all
              reader opinions.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewSummary;
