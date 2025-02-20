import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderTable from './order-table';
import { Shipping } from '@/types';

export const metadata: Metadata = {
  title: 'Order Detailes',
};

const PAYPAL_CLIENT_ID =
  'AVjQgSGgae0j3BkNjkMJKV4r54mdCNtaUdm5YWe3kE112yXpF-2DS9Qdcf03wcIrL5CDs3cl9j3mIWNy';

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
      paypalClientId={process.env.PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID}
    />
  );
};

export default OrderPage;
