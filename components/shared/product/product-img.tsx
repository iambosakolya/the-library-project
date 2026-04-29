'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ProductImage = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className='space-y-4 p-4 md:p-6'>
      <div className='relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg bg-muted'>
        <Image
          src={images[current]}
          alt='Images of the book'
          fill
          sizes='(max-width: 768px) 80vw, 350px'
          className='object-contain'
        />
      </div>

      <div className='flex flex-row justify-center space-x-2'>
        {images.map((image, index) => (
          <div
            className={cn(
              'relative h-16 w-12 cursor-pointer overflow-hidden rounded border-2 transition-colors hover:border-orange-400',
              current === index ? 'border-orange-600' : 'border-transparent',
            )}
            key={image}
            onClick={() => setCurrent(index)}
          >
            <Image
              src={image}
              alt='image'
              fill
              sizes='48px'
              className='object-contain'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
