import { z } from 'zod';
import { formatNumber } from './utils';

const currency = z
  .string()
  .refine(
    (value) => /^.\d+(\.\d{2})?$/.test(formatNumber(Number(value))),
    'Price must be a valid number with two decimal places',
  );

// schema for inserting
export const productInsertSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 character')
    .max(64, 'Name must be at most 64 characters'),
  slug: z
    .string()
    .min(1, 'Slug must be at least 1 character')
    .max(64, 'Slug must be at most 64 characters'),
  category: z
    .string()
    .min(1, 'Category must be at least 1 character')
    .max(64, 'Category must be at most 64 characters'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(1024, 'Description must be at most 1024 characters'),
  images: z
    .array(z.string())
    .min(1, 'There must be at least one image')
    .max(5, 'There must be at most five images'),
  price: currency,
  author: z
    .string()
    .min(1, 'Author must be at least 1 character')
    .max(64, 'Author must be at most 64 characters'),
  stock: z.coerce
    .number()
    .min(0, 'Stock must be at least 0')
    .max(1500, 'Stock must be at most 1500'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

// for signing users
export const signInInsertSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});
