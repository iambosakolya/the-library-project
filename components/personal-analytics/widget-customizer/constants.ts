import { type WidgetConfig } from '../shared/types';

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'streak', label: 'Reading Streak', visible: true, order: 0 },
  { id: 'goals', label: 'Goal Tracking', visible: true, order: 1 },
  { id: 'timeline', label: 'Activity Timeline', visible: true, order: 2 },
  { id: 'genres', label: 'Genre Preferences', visible: true, order: 3 },
  { id: 'reviews', label: 'Review Stats', visible: true, order: 4 },
  { id: 'yearInBooks', label: 'Year in Books', visible: true, order: 5 },
  {
    id: 'participation',
    label: 'Participation History',
    visible: true,
    order: 6,
  },
  { id: 'interactions', label: 'Interaction Network', visible: true, order: 7 },
  { id: 'achievements', label: 'Achievements', visible: true, order: 8 },
  { id: 'privacy', label: 'Privacy Controls', visible: true, order: 9 },
];
