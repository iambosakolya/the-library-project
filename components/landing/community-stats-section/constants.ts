import { BookOpen, Users, CalendarCheck, Globe } from 'lucide-react';
import type { LandingStats } from './community-stats-section';

export function buildStats(data: LandingStats) {
  return [
    {
      label: 'Active Reading Clubs',
      value: data.totalClubs,
      suffix: data.totalClubs > 0 ? '+' : '',
      Icon: BookOpen,
      color: 'text-chart-1',
    },
    {
      label: 'Books Discussed',
      value: data.totalBooksDiscussed,
      suffix: data.totalBooksDiscussed > 0 ? '+' : '',
      Icon: Users,
      color: 'text-chart-2',
    },
    {
      label: 'Events Hosted',
      value: data.totalEvents,
      suffix: data.totalEvents > 0 ? '+' : '',
      Icon: CalendarCheck,
      color: 'text-chart-4',
    },
    {
      label: 'Community Members',
      value: data.totalMembers,
      suffix: data.totalMembers > 0 ? '+' : '',
      Icon: Globe,
      color: 'text-chart-3',
    },
  ];
}

export const DEFAULT_STATS: LandingStats = {
  totalClubs: 0,
  totalEvents: 0,
  totalMembers: 0,
  totalBooksDiscussed: 0,
};
