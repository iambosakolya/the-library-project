'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Users,
  Calendar,
  Star,
  ShoppingBag,
  Library,
} from 'lucide-react';

interface StatsData {
  totalBooks: number;
  totalMembers: number;
  activeClubs: number;
  upcomingEvents: number;
  totalReviews: number;
  totalOrders: number;
}

const statConfig = [
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

export default function CommunityStatsBar({ data }: { data: StatsData }) {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className='transition-shadow hover:shadow-md'>
          <CardHeader className='px-4 pb-1 pt-4'>
            <CardTitle className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <p className='text-2xl font-bold tabular-nums'>
              {data[key]?.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
