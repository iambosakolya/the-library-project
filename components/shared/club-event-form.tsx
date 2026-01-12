'use client';

import { useToast } from '@/hooks/use-toast';
import { clubEventRequestSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createClubRequest } from '@/lib/actions/club-request.actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Product } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ClubEventForm = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<z.infer<typeof clubEventRequestSchema>>({
    resolver: zodResolver(clubEventRequestSchema),
    defaultValues: {
      type: 'club',
      title: '',
      purpose: '',
      description: '',
      startDate: undefined,
      endDate: undefined,
      capacity: 10,
      format: 'online',
      address: '',
      onlineLink: '',
      sessionCount: 4,
      bookIds: [],
    },
  });

  const watchedType = form.watch('type');
  const watchedFormat = form.watch('format');
  const watchedValues = form.watch();

  const onSubmit: SubmitHandler<
    z.infer<typeof clubEventRequestSchema>
  > = async (values) => {
    setIsSubmitting(true);
    try {
      const res = await createClubRequest(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/user/club-requests');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBooks = products.filter((p) =>
    watchedValues.bookIds.includes(p.id),
  );

  if (showPreview) {
    return (
      <Card className='mx-auto max-w-4xl'>
        <CardHeader>
          <CardTitle>
            Preview Your {watchedType === 'club' ? 'Reading Club' : 'Event'}
          </CardTitle>
          <CardDescription>
            Review your submission before sending it for approval
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold'>Type</h3>
            <p className='capitalize'>{watchedValues.type}</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Title</h3>
            <p>{watchedValues.title}</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Purpose</h3>
            <p>{watchedValues.purpose}</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Description</h3>
            <p className='whitespace-pre-wrap'>{watchedValues.description}</p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <h3 className='text-lg font-semibold'>Start Date</h3>
              <p>
                {watchedValues.startDate
                  ? new Date(watchedValues.startDate).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>
            {watchedType === 'club' && watchedValues.endDate && (
              <div>
                <h3 className='text-lg font-semibold'>End Date</h3>
                <p>{new Date(watchedValues.endDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <h3 className='text-lg font-semibold'>Capacity</h3>
              <p>{watchedValues.capacity} people</p>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Session Count</h3>
              <p>{watchedValues.sessionCount} sessions</p>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Format</h3>
            <p className='capitalize'>{watchedValues.format}</p>
          </div>
          {watchedValues.format === 'offline' && watchedValues.address && (
            <div>
              <h3 className='text-lg font-semibold'>Address</h3>
              <p>{watchedValues.address}</p>
            </div>
          )}
          {watchedValues.format === 'online' && watchedValues.onlineLink && (
            <div>
              <h3 className='text-lg font-semibold'>Online Link</h3>
              <p className='break-all'>{watchedValues.onlineLink}</p>
            </div>
          )}
          <div>
            <h3 className='text-lg font-semibold'>Selected Books</h3>
            <ul className='mt-2 space-y-2'>
              {selectedBooks.map((book) => (
                <li key={book.id} className='flex gap-2'>
                  <span className='font-medium'>{book.name}</span>
                  <span className='text-muted-foreground'>
                    by {book.author}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowPreview(false)}
            >
              Back to Edit
            </Button>
            <Button
              type='button'
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto max-w-4xl space-y-8'
      >
        {/* Validation Error Summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <Card className='border-destructive'>
            <CardHeader>
              <CardTitle className='text-destructive'>
                Please fix the following errors:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc space-y-1 pl-5'>
                {Object.entries(form.formState.errors).map(([key, error]) => (
                  <li key={key} className='text-sm text-destructive'>
                    <strong className='capitalize'>{key}:</strong>{' '}
                    {error?.message as string}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Type Selection */}
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex gap-4'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='club' id='club' />
                    <Label htmlFor='club'>Reading Club</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='event' id='event' />
                    <Label htmlFor='event'>Event</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                {watchedType === 'club'
                  ? 'A reading club is an ongoing group that meets regularly'
                  : 'An event is a one-time gathering focused on books'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name='title'
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof clubEventRequestSchema>,
              'title'
            >;
          }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter a catchy title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purpose */}
        <FormField
          control={form.control}
          name='purpose'
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof clubEventRequestSchema>,
              'purpose'
            >;
          }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Input placeholder='What is the main goal?' {...field} />
              </FormControl>
              <FormDescription>
                Briefly describe the main objective of this {watchedType}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name='description'
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof clubEventRequestSchema>,
              'description'
            >;
          }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Provide detailed information about your reading club or event'
                  className='min-h-32'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='startDate'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof clubEventRequestSchema>,
                'startDate'
              >;
            }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type='datetime-local'
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : ''
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchedType === 'club' && (
            <FormField
              control={form.control}
              name='endDate'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof clubEventRequestSchema>,
                  'endDate'
                >;
              }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='datetime-local'
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null,
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for ongoing clubs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Capacity and Session Count */}
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='capacity'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof clubEventRequestSchema>,
                'capacity'
              >;
            }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={2}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of participants
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sessionCount'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof clubEventRequestSchema>,
                'sessionCount'
              >;
            }) => (
              <FormItem>
                <FormLabel>Number of Sessions</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    max={52}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  {watchedType === 'club'
                    ? 'Total meetings planned'
                    : 'Number of discussion sessions'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Format */}
        <FormField
          control={form.control}
          name='format'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex gap-4'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='online' id='online' />
                    <Label htmlFor='online'>Online</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='offline' id='offline' />
                    <Label htmlFor='offline'>Offline</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional: Address or Online Link */}
        {watchedFormat === 'offline' ? (
          <FormField
            control={form.control}
            name='address'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof clubEventRequestSchema>,
                'address'
              >;
            }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter the full address where the event will take place'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name='onlineLink'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof clubEventRequestSchema>,
                'onlineLink'
              >;
            }) => (
              <FormItem>
                <FormLabel>Online Meeting Link</FormLabel>
                <FormControl>
                  <Input
                    type='url'
                    placeholder='https://meet.example.com/your-meeting'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Zoom, Google Meet, or any other platform link
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Book Selection */}
        <FormField
          control={form.control}
          name='bookIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Books</FormLabel>
              <FormDescription>
                Choose one or more books to read and discuss
              </FormDescription>
              <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {products.map((product) => {
                  const isSelected = field.value.includes(product.id);

                  return (
                    <Card
                      key={product.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        const newValue = isSelected
                          ? field.value.filter(
                              (id: string) => id !== product.id,
                            )
                          : [...field.value, product.id];
                        field.onChange(newValue);
                      }}
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-start gap-3'>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => {}}
                            />
                          </div>
                          <div className='flex-1'>
                            <h4 className='font-medium'>{product.name}</h4>
                            <p className='text-sm text-muted-foreground'>
                              by {product.author}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className='flex gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setShowPreview(true)}
          >
            Preview
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            onClick={() => {
              // Log validation errors if any
              const errors = form.formState.errors;
              if (Object.keys(errors).length > 0) {
                console.log('Form validation errors:', errors);
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClubEventForm;
