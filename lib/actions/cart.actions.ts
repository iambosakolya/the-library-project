'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObj, formatError, roundToTwo } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// cart price
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundToTwo(
      items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0),
    ),
    shippingPrice = roundToTwo(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwo(0.15 * itemsPrice),
    totalPrice = roundToTwo(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // check cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('No cart found');

    // get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cart = await getMyCart();
    //prse ans validate item
    const item = cartItemSchema.parse(data);

    // fins product is db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error('Product not found');

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add to db
      await prisma.cart.create({ data: newCart });

      revalidatePath(`/product/${product.slug}`);

      return { success: true, message: `${product.name} added to cart` };
    } else {
      // check if item in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        // check avaliability
        if (product.stock < existItem.quantity + 1) {
          throw new Error('Not enough stock');
        }

        // increase if exists
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.quantity = existItem.quantity + 1;
      } else {
        // check avaliability
        if (product.stock < 1) {
          throw new Error('Not enough stock');
        }

        // add to cart.items
        cart.items.push(item);
      }

      // add to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existItem ? 'updated in' : 'added to'
        } cart`,
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getMyCart() {
  // check cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('No cart found');

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObj({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
