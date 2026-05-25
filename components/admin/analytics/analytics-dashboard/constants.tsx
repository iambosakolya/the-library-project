import { TrendingUp, Users, CalendarDays, BarChart3 } from 'lucide-react';
import type { AnalyticsCategory } from '../shared/types';

export const CATEGORIES: {
  value: AnalyticsCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'reading_trends',
    label: 'Reading Trends',
    icon: <TrendingUp className='h-4 w-4' />,
  },
  {
    value: 'community_engagement',
    label: 'Community Engagement',
    icon: <Users className='h-4 w-4' />,
  },
  {
    value: 'events_clubs',
    label: 'Events & Clubs',
    icon: <CalendarDays className='h-4 w-4' />,
  },
  {
    value: 'user_behavior',
    label: 'User Behavior',
    icon: <BarChart3 className='h-4 w-4' />,
  },
];

export const PERIODS = [
  { value: 'last_7', label: 'Last 7 Days' },
  { value: 'last_30', label: 'Last 30 Days' },
  { value: 'last_90', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
];
