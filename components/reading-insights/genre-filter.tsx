'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface GenreFilterProps {
  genres: string[];
  value: string;
  onChange: (genre: string) => void;
}

export default function GenreFilter({
  genres,
  value,
  onChange,
}: GenreFilterProps) {
  return (
    <div className='flex items-center gap-2'>
      <Filter className='h-4 w-4 text-muted-foreground' />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='h-8 w-[160px] text-xs'>
          <SelectValue placeholder='All Genres' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all' className='text-xs'>
            All Genres
          </SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre} className='text-xs'>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
