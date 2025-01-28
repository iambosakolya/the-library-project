import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <>{product.name}</>;
};

export default ProductPage;
