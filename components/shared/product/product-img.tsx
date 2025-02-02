'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ProductImage = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className='space-y-6 p-8'>
      <Image
        src={images[current]}
        alt='Images of the book'
        width={1000}
        height={1000}
      />

      <div className='flex flex-row space-x-2'>
        {images.map((image, index) => (
          <div
            className={cn(
              'mr-2 cursor-pointer border hover:border-orange-400',
              current === index && 'border-orange-600',
            )}
            key={image}
            onClick={() => {
              setCurrent(index);
              console.log('Image changed');
            }}
          >
            <Image src={image} alt='image' width={120} height={120} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
