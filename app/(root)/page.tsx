import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
import BannerMain from '@/components/shared/product/banner';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <BannerMain />
      <ProductList data={latestProducts} title='Featured Books' limit={4} />
    </>
  );
};

export default HomePage;
