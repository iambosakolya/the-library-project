import { z } from 'zod';
import {
  productInsertSchema,
  insertCartSchema,
  cartItemSchema,
  shippingSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  clubEventRequestSchema,
  registrationSchema,
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
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type ClubEventRequest = z.infer<typeof clubEventRequestSchema> & {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type ReadingClub = {
  id: string;
  clubRequestId: string;
  title: string;
  purpose: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  capacity: number;
  format: 'online' | 'offline';
  address: string | null;
  onlineLink: string | null;
  sessionCount: number;
  bookIds: string[];
  creatorId: string;
  memberIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export type Event = {
  id: string;
  eventRequestId: string;
  title: string;
  purpose: string;
  description: string;
  eventDate: Date;
  capacity: number;
  format: 'online' | 'offline';
  address: string | null;
  onlineLink: string | null;
  bookIds: string[];
  organizerId: string;
  attendeeIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizer?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export type PaginationResult<T> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  message?: string;
};

export type RegistrationInput = z.infer<typeof registrationSchema>;

export type Registration = {
  id: string;
  userId: string;
  clubId: string | null;
  eventId: string | null;
  status: 'active' | 'cancelled';
  registeredAt: Date;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  club?: ReadingClub | null;
  event?: Event | null;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};
