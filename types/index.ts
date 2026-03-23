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
  bookSubmissionSchema,
  editClubEventSchema,
  attendanceSchema,
  participantMessageSchema,
  reviewSchema,
  reviewReplySchema,
  reviewReportSchema,
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
  changeHistory?: ChangeHistoryEntry[];
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
  changeHistory?: ChangeHistoryEntry[];
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

export type EditClubEventInput = z.infer<typeof editClubEventSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type ParticipantMessageInput = z.infer<typeof participantMessageSchema>;

export type ChangeHistoryEntry = {
  field: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
  changedBy: string;
};

export type Attendance = {
  id: string;
  userId: string;
  clubId: string | null;
  eventId: string | null;
  sessionNumber: number;
  status: 'present' | 'absent' | 'excused';
  notes: string | null;
  markedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export type EngagementMetrics = {
  totalRegistrations: number;
  activeRegistrations: number;
  cancelledRegistrations: number;
  capacityUtilization: number;
  attendanceRate: number;
  totalSessions: number;
  sessionsCompleted: number;
};

export type MyClubOrEvent = {
  id: string;
  title: string;
  type: 'club' | 'event';
  isActive: boolean;
  format: 'online' | 'offline';
  startDate: Date;
  endDate?: Date | null;
  capacity: number;
  participantCount: number;
  registrationCount: number;
  requestStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

export type ReviewInput = z.infer<typeof reviewSchema>;

export type UserBadge = {
  type: 'club' | 'event';
  id: string;
  title: string;
};

export type ReviewUser = {
  id: string;
  name: string;
  image: string | null;
  badges?: UserBadge[];
};

export type Review = ReviewInput & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: ReviewUser;
  replies?: ReviewReply[];
  helpfulCount?: number;
  notHelpfulCount?: number;
  currentUserVote?: boolean | null;
};

export type ReviewReplyInput = z.infer<typeof reviewReplySchema>;

export type ReviewReply = {
  id: string;
  userId: string;
  reviewId: string;
  parentId: string | null;
  depth: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user?: ReviewUser;
  children?: ReviewReply[];
};

export type ReviewReportInput = z.infer<typeof reviewReportSchema>;

export type ReviewReport = ReviewReportInput & {
  id: string;
  userId: string;
  createdAt: Date;
};

export type ReviewVote = {
  id: string;
  userId: string;
  reviewId: string;
  isHelpful: boolean;
  createdAt: Date;
};

export type UserPublicProfile = {
  id: string;
  name: string;
  image: string | null;
  createdAt: Date;
  clubs: { id: string; title: string; isActive: boolean }[];
  organizedEvents: { id: string; title: string; isActive: boolean }[];
  registeredEvents: { id: string; title: string; eventDate: Date }[];
  totalReviews: number;
  recentReviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    product: { slug: string; name: string };
  }[];
  followerCount: number;
  followingCount: number;
  isFollowedByCurrentUser: boolean;
};

export type BookSubmissionInput = z.infer<typeof bookSubmissionSchema>;

export type BookSubmission = BookSubmissionInput & {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  adminNotes: string | null;
  productId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};
