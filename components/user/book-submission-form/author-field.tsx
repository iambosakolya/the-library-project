'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { submissionFormStyles } from './styles';
import { AuthorFieldProps } from '../shared/types';

export default function AuthorField({
  form,
  authorSuggestions,
  onSelectAuthor,
}: AuthorFieldProps) {
  return (
    <FormField
      control={form.control}
      name='author'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Author *</FormLabel>
          <FormControl>
            <div className={submissionFormStyles.authorWrapper}>
              <Input placeholder='Enter author name' {...field} />
              {authorSuggestions.length > 0 && (
                <Card className={submissionFormStyles.authorDropdown}>
                  <CardContent
                    className={submissionFormStyles.authorDropdownContent}
                  >
                    {authorSuggestions.map((author) => (
                      <button
                        type='button'
                        key={author}
                        className={submissionFormStyles.authorOption}
                        onClick={() => onSelectAuthor(author)}
                      >
                        {author}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </FormControl>
          <FormDescription>Start typing to see suggestions</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
