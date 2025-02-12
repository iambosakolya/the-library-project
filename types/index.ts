import { z } from 'zod';
import {
  productInsertSchema,
  insertCartSchema,
  cartItemSchema,
} from '@/lib/validators';

export type Product = z.infer<typeof productInsertSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
