import { PrismaClient } from '@/src/generated/prisma';

// Validate that DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please check your .env file.',
  );
}

// Create a singleton function for PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          needs: { rating: true },
          compute(product) {
            return product.rating.toString();
          },
        },
      },
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart: { itemsPrice: unknown }) {
            return String(cart.itemsPrice);
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart: { taxPrice: unknown }) {
            return String(cart.taxPrice);
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart: { shippingPrice: unknown }) {
            return String(cart.shippingPrice);
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart: { totalPrice: unknown }) {
            return String(cart.totalPrice);
          },
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(order: { itemsPrice: unknown }) {
            return String(order.itemsPrice);
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(order: { taxPrice: unknown }) {
            return String(order.taxPrice);
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(order: { shippingPrice: unknown }) {
            return String(order.shippingPrice);
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(order: { totalPrice: unknown }) {
            return String(order.totalPrice);
          },
        },
      },
      orderItem: {
        price: {
          needs: { price: true },
          compute(orderItem) {
            return orderItem.price.toString();
          },
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientSingleton | undefined;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
