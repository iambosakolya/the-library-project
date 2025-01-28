import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import ProductPrice from './product-price';
import { Product } from '@/types';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className='w-full w-max-sm'>
      <CardHeader className='p-0 items center'>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className=''>
        <p className='mt-2 flex justify-end'>{product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className='flex justify-end text-lg font-semibold'>
            {product.name}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className='flex-between gap-4 font-semibold'>
        {product.stock === 0 ? (
          <p className='text-destructive'>Out of stock</p>
        ) : (
          <ProductPrice value={Number(product.price)} />
        )}
        <p>{product.rating} ⭐</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
