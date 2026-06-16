'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { DollarSign } from 'lucide-react';
import { submissionFormStyles } from './styles';
import { type SaleSectionProps } from '../shared/types';

export default function SaleSection({
  form,
  watchedIsForSale,
}: SaleSectionProps) {
  return (
    <Card className={submissionFormStyles.sectionCard}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base'>
          <DollarSign className={submissionFormStyles.saleTitleIcon} />
          Selling Information
        </CardTitle>
        <CardDescription>Is this book available for sale?</CardDescription>
      </CardHeader>
      <CardContent className={submissionFormStyles.saleCardContent}>
        <FormField
          control={form.control}
          name='isForSale'
          render={({ field }) => (
            <FormItem className={submissionFormStyles.saleToggle}>
              <div className={submissionFormStyles.saleToggleLabel}>
                <FormLabel className='text-base'>For Sale</FormLabel>
                <FormDescription>
                  Toggle this if the book is available for purchase
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedIsForSale && (
          <FormField
            control={form.control}
            name='suggestedPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suggested Price *</FormLabel>
                <FormControl>
                  <div className={submissionFormStyles.priceWrapper}>
                    <DollarSign className={submissionFormStyles.priceIcon} />
                    <Input
                      type='number'
                      step='0.01'
                      min='0.01'
                      placeholder='Enter suggested price'
                      className={submissionFormStyles.priceInput}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the amount you would like to sell this book for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
