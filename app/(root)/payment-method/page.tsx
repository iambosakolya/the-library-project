import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.actions';
import CheckOutSteps from '@/components/shared/checkout-steps';
import PaymentMethodForm from './payment-method-form';

export const metadata: Metadata = {
  title: 'Payment method',
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User id is not found');

  const user = await getUserById(userId);

  return (
    <>
      <CheckOutSteps current={2} />
      <PaymentMethodForm prefferdPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
