'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { periods } from './constants';
import { periodFilterStyles as styles } from './styles';

export type Period = (typeof periods)[number]['value'];

export default function PeriodFilter({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className={styles.wrapper}>
      <Calendar className={styles.icon} />
      <Select value={value} onValueChange={(v) => onChange(v as Period)}>
        <SelectTrigger className={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem
              key={p.value}
              value={p.value}
              className={styles.selectItem}
            >
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
