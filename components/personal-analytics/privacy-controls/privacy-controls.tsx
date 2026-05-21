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
import { privacyControlsStyles as styles } from './styles';

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
        <CardTitle className={styles.headerTitle}>
          <Shield className={styles.headerIcon} />
          Privacy Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={styles.description}>
          Control who can see different aspects of your reading analytics.
        </p>
        <div className={styles.list}>
          {Object.entries(SETTING_LABELS).map(([key, meta]) => (
            <div key={key} className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>{meta.label}</p>
                <p className={styles.settingDescription}>{meta.description}</p>
              </div>
              <Select
                value={(settings as Record<string, string>)[key] || 'public'}
                onValueChange={(value) => onUpdate(key, value)}
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className={styles.optionLabel}>
                        <opt.icon className={styles.optionIcon} />
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
