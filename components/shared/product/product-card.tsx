import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import ProductPrice from './product-price';
import { Product } from '@/types';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className='group w-full overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className='block'>
        <div className='relative aspect-[3/4] max-h-64 w-full overflow-hidden bg-muted'>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw'
            className='object-contain transition-transform duration-300 group-hover:scale-105'
            priority={true}
          />
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <span className='rounded-full bg-destructive px-3 py-1 text-sm font-semibold text-destructive-foreground'>
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardContent className='p-4'>
        {/* Category Badge */}
        <span className='mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground'>
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className='line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors hover:text-primary'>
            {product.name}
          </h3>
        </Link>

        {/* Author */}
        <p className='mt-1 truncate text-xs text-muted-foreground'>
          by {product.author}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className='flex items-center justify-between border-t px-4 py-3'>
        {product.stock === 0 ? (
          <p className='text-sm font-medium text-destructive'>Unavailable</p>
        ) : (
          <ProductPrice
            value={Number(product.price)}
            className='text-lg font-bold'
          />
        )}
        <div className='flex items-center gap-1'>
          <span className='text-sm text-amber-500'>★</span>
          <span className='text-sm font-medium text-muted-foreground'>
            {product.rating}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
