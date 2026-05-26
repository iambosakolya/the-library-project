'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Badge } from '../../ui/badge';
import { X } from 'lucide-react';
import { BOOK_GENRES } from '@/lib/constants';
import { submissionFormStyles } from './styles';
import { CategoriesSelectorProps } from '../shared/types';

export default function CategoriesSelector({
  form,
  watchedCategories,
  onAddCategory,
  onRemoveCategory,
}: CategoriesSelectorProps) {
  return (
    <FormField
      control={form.control}
      name='categories'
      render={() => (
        <FormItem>
          <FormLabel>Categories / Genres *</FormLabel>
          <Select onValueChange={onAddCategory}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select categories' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {BOOK_GENRES.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className={submissionFormStyles.categoriesBadges}>
            {watchedCategories?.map((category) => (
              <Badge key={category} variant='secondary'>
                {category}
                <button
                  type='button'
                  className={submissionFormStyles.categoryRemove}
                  onClick={() => onRemoveCategory(category)}
                >
                  <X className={submissionFormStyles.categoryRemoveIcon} />
                </button>
              </Badge>
            ))}
          </div>
          <FormDescription>Select at least one category</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
