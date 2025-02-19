import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { Shipping } from '@/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckOutSteps from '@/components/shared/checkout-steps';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from './place-order-form';

export const metadata: Metadata = {
  title: 'Place order',
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User id is not found');

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as Shipping;

  return (
    <>
      <CheckOutSteps current={3} />
      <h1 className='py-4 text-2xl'>Place Order</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='space-y-4 overflow-x-auto md:col-span-2'>
          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Shipping address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{' '}
                {userAddress.postalCode}, {userAddress.country}{' '}
              </p>
              <div className='mt-3'>
                <Link href='/shipping'>
                  <Button>
                    Change address
                    <ArrowRight className='h-4 w-4 animate-pulse' />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Payment method</h2>
              <p>{user.paymentMethod}</p>
              <div className='mt-3'>
                <Link href='/payment-method'>
                  <Button variant='outline'>
                    Change payment method
                    <ArrowRight className='h-4 w-4 animate-pulse' />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Order items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quanitiy</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/{item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                          />
                          <span className='px-4'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.quantity}</span>
                      </TableCell>
                      <TableCell>
                        <span className='px-2 text-right'>${item.price}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='gap-4 space-y-4 p-4'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>

              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>

              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>

              <div className='flex justify-between font-bold'>
                <div>Total:</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
