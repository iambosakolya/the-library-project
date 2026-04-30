import { CalendarDays, MessageSquare, BarChart3, Users } from 'lucide-react';

export const features = [
  {
    title: 'Reading Clubs',
    description:
      'Create or join reading clubs. Discuss your favorite books with like-minded readers.',
    Icon: Users,
    color: 'from-chart-1/20 to-chart-1/5',
    iconColor: 'text-chart-1',
    animation: 'pages',
  },
  {
    title: 'Literary Events',
    description:
      'Attend author meetups, book launches, and reading sessions online or in-person.',
    Icon: CalendarDays,
    color: 'from-chart-2/20 to-chart-2/5',
    iconColor: 'text-chart-2',
    animation: 'calendar',
  },
  {
    title: 'Book Reviews & Discussions',
    description:
      'Share reviews, rate books, and engage in meaningful literary discussions.',
    Icon: MessageSquare,
    color: 'from-chart-4/20 to-chart-4/5',
    iconColor: 'text-chart-4',
    animation: 'stars',
  },
  {
    title: 'Personal Reading Analytics',
    description:
      'Track your reading journey with insights and personalized recommendations.',
    Icon: BarChart3,
    color: 'from-chart-3/20 to-chart-3/5',
    iconColor: 'text-chart-3',
    animation: 'chart',
  },
];
