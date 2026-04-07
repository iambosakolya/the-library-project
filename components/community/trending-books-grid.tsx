'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingBook {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  numReviews: number;
  totalSold: number;
  recentReviews: number;
}

export default function TrendingBooksGrid({
  books,
}: {
  books: TrendingBook[];
}) {
  if (!books?.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No trending data available yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5 text-orange-500' />
          Currently Trending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {books.map((book, idx) => (
            <Link
              key={book.id}
              href={`/product/${book.slug}`}
              className='group relative flex flex-col rounded-lg border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg'
            >
              {idx < 3 && (
                <Badge className='absolute -right-2 -top-2 z-10 bg-orange-500 text-xs text-white'>
                  #{idx + 1}
                </Badge>
              )}
              <div className='relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted'>
                <Image
                  src={book.image}
                  alt={book.name}
                  fill
                  className='object-cover transition-transform group-hover:scale-105'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                />
              </div>
              <h3 className='line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary'>
                {book.name}
              </h3>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                {book.author}
              </p>
              <div className='mt-2 flex items-center justify-between text-xs'>
                <span className='font-medium'>${book.price.toFixed(2)}</span>
                <span className='text-muted-foreground'>
                  {'★'.repeat(Math.round(book.rating))} ({book.numReviews})
                </span>
              </div>
              <div className='mt-1.5 flex gap-2'>
                <Badge variant='secondary' className='text-[10px]'>
                  {book.totalSold} sold
                </Badge>
                {book.recentReviews > 0 && (
                  <Badge variant='outline' className='text-[10px]'>
                    {book.recentReviews} new reviews
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
