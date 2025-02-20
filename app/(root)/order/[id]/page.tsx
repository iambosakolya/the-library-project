import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderTable from './order-table';
import { Shipping } from '@/types';

export const metadata: Metadata = {
  title: 'Order Detailes',
};

const OrderPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <OrderTable
      order={{
        ...order,
        Shipping: order.Shipping as Shipping,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    />
  );
};

export default OrderPage;
