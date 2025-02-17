import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Shipping } from '@/types';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingForm from './shipping-form';

export const metadata: Metadata = {
  title: 'Shipping',
};

const ShippingPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) throw new Error('User id is not found');

  const user = await getUserById(userId);

  return (
    <>
      <ShippingForm address={user.address as Shipping} />
    </>
  );
};

export default ShippingPage;
