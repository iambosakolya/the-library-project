import { Eye, Users, Lock } from 'lucide-react';

export const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    icon: Eye,
    description: 'Visible to everyone',
  },
  {
    value: 'friends_only',
    label: 'Friends Only',
    icon: Users,
    description: 'Visible to followers',
  },
  { value: 'private', label: 'Private', icon: Lock, description: 'Only you' },
];

export const SETTING_LABELS: Record<
  string,
  { label: string; description: string }
> = {
  profileVisibility: {
    label: 'Profile Analytics',
    description: 'Genre preferences and reading stats on your public profile',
  },
  goalsVisibility: {
    label: 'Reading Goals',
    description: 'Your goal progress and targets',
  },
  streakVisibility: {
    label: 'Reading Streak',
    description: 'Your current and best streak',
  },
  reviewsVisibility: {
    label: 'Review Statistics',
    description: 'Detailed review writing statistics',
  },
  activityVisibility: {
    label: 'Activity Timeline',
    description: 'Your reading activity and participation history',
  },
};
