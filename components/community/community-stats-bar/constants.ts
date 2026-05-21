import {
  BookOpen,
  Users,
  Calendar,
  Star,
  ShoppingBag,
  Library,
} from 'lucide-react';

export const statConfig = [
  {
    key: 'totalBooks' as const,
    label: 'Books',
    icon: BookOpen,
    color: 'text-indigo-500',
  },
  {
    key: 'totalMembers' as const,
    label: 'Members',
    icon: Users,
    color: 'text-emerald-500',
  },
  {
    key: 'activeClubs' as const,
    label: 'Active Clubs',
    icon: Library,
    color: 'text-violet-500',
  },
  {
    key: 'upcomingEvents' as const,
    label: 'Upcoming Events',
    icon: Calendar,
    color: 'text-amber-500',
  },
  {
    key: 'totalReviews' as const,
    label: 'Reviews',
    icon: Star,
    color: 'text-rose-500',
  },
  {
    key: 'totalOrders' as const,
    label: 'Purchases',
    icon: ShoppingBag,
    color: 'text-sky-500',
  },
];
