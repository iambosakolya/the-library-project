import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
// import { ShoppingBag } from 'lucide-react';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImage from '@/components/shared/product/product-img';
import AddToCart from '@/components/shared/product/add-cart';
import { getMyCart } from '@/lib/actions/cart.actions';

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cart = await getMyCart();

  return (
    <section>
      <div className='grid grid-cols-1 md:grid-cols-4'>
        {/* images */}
        <div className='col-span-2'>
          <ProductImage images={product.images} />
        </div>
        {/* detailes */}
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
            {/* <h2 className=''>{product.price}$</h2> */}
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
                  price: product.price,
                  quantity: 1,
                  image: product.images![0],
                }}
              />
            ) : (
              // <Button className='w-full rounded-3xl text-lg'>
              //   <ShoppingBag />
              //   Add to cart
              // </Button>
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
            <p>Viewed {product.numReviews} times</p>
            <p className='text-xl font-bold'>DESCRIPTION</p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </section>

    // <Image
    //   className='p-4'
    //   src={product.images[0]}
    //   alt={product.name}
    //   width={500}
    //   height={700}
    //   priority={true}
    // />

    // products: [
    //   {
    //     name: 'The Catcher in the Rye',
    //     slug: 'the-catcher-in-the-rye',
    //     category: 'Fiction',
    //     description: 'A timeless classic exploring teenage rebellion and angst.',
    //     images: [
    //       '/images/sample-products/p1-1.jpg',
    //       '/images/sample-products/p1-2.jpg',
    //     ],
    //     price: 14.99,
    //     author: 'J.D. Salinger',
    //     rating: 4.5,
    //     numReviews: 1245,
    //     stock: 10,
    //     isFeatured: true,
    //     banner: 'banner-1.jpg',
    //   },
  );
};

export default ProductPage;
