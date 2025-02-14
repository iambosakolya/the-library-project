'use client';

// import { ShoppingBag, Minus, Plus, Loader } from 'lucide-react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';
// import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
// import { useTransition } from 'react';

// const AddToCart = ({ cart, item }: { cart: Cart; item: CartItem }) => {

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({ variant: 'destructive', description: res.message });
      return;
    }

    // adding to cart
    toast({
      description: res.message,
      action: (
        <ToastAction
          className='bg-primary text-white hover:bg-gray-900'
          altText='Go to cart'
          onClick={() => router.push('/cart')}
        >
          Go to cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button type='button' onClick={handleAddToCart}>
      Add to cart
    </Button>
  );
};

//   const router = useRouter();
//   const { toast } = useToast();
//   const [isPending, startTransition] = useTransition();

//   const handleAddToCart = async () => {
//     startTransition(async () => {});

//     const res = await addItemToCart(item);

//     if (!res.success) {
//       toast({
//         variant: 'destructive',
//         description: res.message,
//       });
//       return;
//     }

//     // adding to cart
//     toast({
//       description: res.message,
//       action: (
//         <ToastAction
//           className='bg-primary text-white hover:bg-gray-900'
//           altText='Go to cart'
//           onClick={() => router.push('/cart')}
//         >
//           Go to cart
//         </ToastAction>
//       ),
//     });
//   };

//   //remove from cart
//   const handleRemoveFromCart = async () => {
//     startTransition(async () => {
//       const res = await removeItemFromCart(item.productId);

//       toast({
//         variant: res.success ? 'default' : 'destructive',
//         description: res.message,
//       });
//       return;
//     });
//   };

//   // check if item is in cart
//   const existItem =
//     cart && cart.items.find((x) => x.productId === item.productId);

//   return existItem ? (
//     <div>
//       <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
//         {isPending ? (
//           <Loader className='h-4 w-4 animate-spin' />
//         ) : (
//           <Minus className='h-4 w-4' />
//         )}
//       </Button>
//       <span className='px-2'>{existItem.quantity}</span>
//       <Button type='button' variant='outline' onClick={handleAddToCart}>
//         {isPending ? (
//           <Loader className='h-4 w-4 animate-spin' />
//         ) : (
//           <Plus className='h-4 w-4' />
//         )}
//       </Button>
//     </div>
//   ) : (
//     <Button
//       className='w-full rounded-3xl text-lg'
//       variant='outline'
//       onClick={handleAddToCart}
//     >
//       {isPending ? (
//         <Loader className='h-4 w-4 animate-spin' />
//       ) : (
//         <ShoppingBag className='h-4 w-4' />
//       )}
//       Add to Cart
//     </Button>
//   );
// };

export default AddToCart;
