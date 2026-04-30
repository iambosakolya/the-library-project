import { UserPlus, Search, MessageCircle, TrendingUp } from 'lucide-react';

export const steps = [
  {
    num: 1,
    title: 'Create your reader profile',
    description:
      'Sign up and tell us about your reading preferences and favorite genres.',
    Icon: UserPlus,
    accent: 'bg-chart-1/15 text-chart-1 border-chart-1/30',
  },
  {
    num: 2,
    title: 'Browse clubs & events',
    description:
      'Discover reading clubs and literary events that match your interests.',
    Icon: Search,
    accent: 'bg-chart-2/15 text-chart-2 border-chart-2/30',
  },
  {
    num: 3,
    title: 'Participate & discuss',
    description:
      'Join discussions, attend events, and share your thoughts with fellow readers.',
    Icon: MessageCircle,
    accent: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  },
  {
    num: 4,
    title: 'Track & discover',
    description:
      'Track your reading progress, earn badges, and get personalized recommendations.',
    Icon: TrendingUp,
    accent: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  },
];
