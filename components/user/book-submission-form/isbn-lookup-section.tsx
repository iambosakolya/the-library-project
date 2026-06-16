'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search, Loader2 } from 'lucide-react';
import { submissionFormStyles } from './styles';
import { IsbnLookupSectionProps } from '../shared/types';

export default function IsbnLookupSection({
  form,
  isbnLookupLoading,
  watchedIsbn,
  onLookup,
}: IsbnLookupSectionProps) {
  return (
    <Card className={submissionFormStyles.sectionCard}>
      <CardHeader>
        <CardTitle className={submissionFormStyles.sectionCardTitle}>
          Quick Fill with ISBN
        </CardTitle>
        <CardDescription>
          Enter an ISBN to automatically fill book details from Google Books
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={submissionFormStyles.isbnRow}>
          <FormField
            control={form.control}
            name='isbn'
            render={({ field }) => (
              <FormItem className={submissionFormStyles.isbnInput}>
                <FormControl>
                  <Input
                    placeholder='Enter ISBN (10 or 13 digits)'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='button'
            onClick={onLookup}
            disabled={isbnLookupLoading || !watchedIsbn}
          >
            {isbnLookupLoading ? (
              <Loader2 className={submissionFormStyles.lookupIconSpin} />
            ) : (
              <Search className={submissionFormStyles.lookupIcon} />
            )}
            <span className={submissionFormStyles.lookupText}>Lookup</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
