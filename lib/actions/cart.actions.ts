'use server';

import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { convertToPlainObj, formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { roundToTwo } from '../utils';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// calculate cart prices
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
    // check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('error');

    // get seesion and usr id
    const session = await auth();
    const userid = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error('Not found');

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userid,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add to db
      await prisma.cart.create({
        data: newCart,
      });

      // revalidate the product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // check if the item is in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        // check stock
        if (product.stock < existItem.quantity + 1) {
          throw new Error('Not enough stock');
        }

        // increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.quantity = existItem.quantity + 1;
      } else {
        // if item does not exist in the cart
        // check stock
        if (product.stock < 1) throw new Error('Not enough stock');
        // add item to the cart.items
        cart.items.push(item);
      }

      // save to database
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
        message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('error');

  // get seesion and usr id
  const session = await auth();
  const userid = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userid ? { userId: userid } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert decimals and return
  return convertToPlainObj({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('error');

    // get the product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );
    if (!exist) throw new Error('Item is not found');

    // check if only one in quantity
    if (exist.quantity === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId,
      );
    } else {
      // decrease quantity
      (cart.items as CartItem[]).find(
        (x) => x.productId === productId,
      )!.quantity = exist.quantity - 1;
    }
    //update cart in db
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
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
