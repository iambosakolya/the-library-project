'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Eye, Users, Lock } from 'lucide-react';
import type { PrivacySettings } from '@/lib/actions/personal-analytics.actions';

const VISIBILITY_OPTIONS = [
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

const SETTING_LABELS: Record<string, { label: string; description: string }> = {
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

export default function PrivacyControls({
  settings,
  onUpdate,
}: {
  settings: PrivacySettings;
  onUpdate: (key: string, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='h-5 w-5 text-green-500' />
          Privacy Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='mb-4 text-sm text-muted-foreground'>
          Control who can see different aspects of your reading analytics.
        </p>
        <div className='space-y-4'>
          {Object.entries(SETTING_LABELS).map(([key, meta]) => (
            <div
              key={key}
              className='flex items-center justify-between gap-4 rounded-lg border p-3'
            >
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{meta.label}</p>
                <p className='text-xs text-muted-foreground'>
                  {meta.description}
                </p>
              </div>
              <Select
                value={(settings as Record<string, string>)[key] || 'public'}
                onValueChange={(value) => onUpdate(key, value)}
              >
                <SelectTrigger className='w-[140px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className='flex items-center gap-2'>
                        <opt.icon className='h-3 w-3' />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
