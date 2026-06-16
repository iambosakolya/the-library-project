'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import type { GenreFilterProps } from '../shared/types';
import { genreFilterStyles as styles } from './styles';

export default function GenreFilter({
  genres,
  value,
  onChange,
}: GenreFilterProps) {
  return (
    <div className={styles.wrapper}>
      <Filter className={styles.icon} />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder='All Genres' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all' className={styles.item}>
            All Genres
          </SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre} className={styles.item}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
