import { z } from 'zod';
import { formatNumber } from './utils';
import { PAYMENT_METHODS } from './constants';

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumber(Number(value))),
    'Price must have exactly two decimal places',
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

// for signing
export const signInInsertSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

// for registaring
export const registerInsertSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least 1 character'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(5, 'Password must be at least 5 characters'),
    confirmPassword: z
      .string()
      .min(5, 'Password must be at least 5 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords aren't the same",
    path: ['confirmPassword'],
  });

// certain item in the cart
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  quantity: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency,
});

// the whole cart
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable(),
});

// shipping detailes
export const shippingSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method must be chosen'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  });

// insert order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingSchema,
});

// insert order item
export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, 'User is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  quantity: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency,
});
