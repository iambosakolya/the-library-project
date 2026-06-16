'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield } from 'lucide-react';
import type { PrivacySettings } from '@/lib/actions/personal-analytics.actions';
import { privacyControlsStyles as styles } from './styles';
import { SETTING_LABELS, VISIBILITY_OPTIONS } from './constants';

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
