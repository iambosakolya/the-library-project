'use client';

import { Cart } from '@/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
// import { ToastAction } from '@/components/ui/toast';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className='flex justify-center py-11 text-3xl font-bold'>
        SHOPPING CART
      </h1>
      {!cart || cart?.items.length === 0 ? (
        <div className='text-lg'>
          {' '}
          Cart is empty.{' '}
          <Link href='/'>
            <span className='underline underline-offset-2'>
              Go back shopping
            </span>
          </Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className='flex items-center'
                      >
                        <Image
                          src={item.image}
                          alt='Product image'
                          width={80}
                          height={80}
                        />
                        <p className='ps-4'>{item.name}</p>
                      </Link>
                    </TableCell>
                    <TableCell className='flex-center gap-2'>
                      <Button
                        disabled={isPending}
                        variant='outline'
                        type='button'
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );

                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className='h-4 w-4 animate-spin' />
                        ) : (
                          <Minus className='h-4 w-4' />
                        )}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant='outline'
                        type='button'
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);

                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className='h-4 w-4 animate-spin' />
                        ) : (
                          <Plus className='h-4 w-4' />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span>{item.price}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='gap-4 p-4'>
              <div className='pb-4 text-xl'>
                Subtotal({cart.items.reduce((a, c) => a + c.quantity, 0)}):
                <span className='font-bold'>
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push('/shipping'))
                }
              >
                {isPending ? (
                  <Loader className='h-4 w-4 animate-spin' />
                ) : (
                  <ArrowRight className='h-4 w-4 animate-pulse' />
                )}{' '}
                Proceed to checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
