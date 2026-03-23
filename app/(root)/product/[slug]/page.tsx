import { getProductBySlug } from '@/lib/actions/product.actions';
import { getProductReviews } from '@/lib/actions/review.actions';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImage from '@/components/shared/product/product-img';
import AddToCart from '@/components/shared/product/cart-add';
import ReviewList from '@/components/shared/product/review-list';
import ReviewSummary from '@/components/shared/product/review-summary';
import { getMyCart } from '@/lib/actions/cart.actions';

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [cart, session, reviewsResult] = await Promise.all([
    getMyCart(),
    auth(),
    getProductReviews(product.id),
  ]);

  const reviews = reviewsResult.success ? reviewsResult.data ?? [] : [];

  return (
    <section>
      <div className='grid grid-cols-1 md:grid-cols-4'>
        <div className='col-span-2'>
          <ProductImage images={product.images} />
        </div>
        <div className='col-span-2 p-6 text-lg'>
          <div className='flex flex-col gap-6'>
            <p>
              Avaliability:
              <span className='text-stone-500'> {product.stock} in stock</span>
            </p>
            <h1 className='h2-bold'>
              {product.name}, {product.author}
            </h1>
            <p>Category: {product.category} </p>
            <ProductPrice
              value={Number(product.price)}
              className='h1-bold w-24 text-green-600'
            />
            {product.stock > 0 ? (
              <AddToCart
                cart={cart}
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  quantity: 1,
                  image: product.images![0],
                  price: product.price,
                }}
              />
            ) : (
              <Badge
                className='w-full justify-center text-lg'
                variant='destructive'
              >
                Not avaliable
              </Badge>
            )}
            <p>
              Rated as <span className='text-red-600'> {product.rating} </span>
              of 5
            </p>
            <p>{product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</p>
            <p className='text-xl font-bold'>DESCRIPTION</p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <div className='mt-10 border-t pt-8 space-y-6'>
        <ReviewSummary productId={product.id} numReviews={product.numReviews} />
        <ReviewList
          reviews={reviews}
          userId={session?.user?.id}
          productId={product.id}
        />
      </div>
    </section>
  );
};

export default ProductPage;
