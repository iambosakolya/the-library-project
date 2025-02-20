import { z } from 'zod';
import {
  productInsertSchema,
  insertCartSchema,
  cartItemSchema,
  shippingSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
} from '@/lib/validators';

export type Product = z.infer<typeof productInsertSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Shipping = z.infer<typeof shippingSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  isPaid: Boolean;
  paidAt: Date | null;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  idDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
