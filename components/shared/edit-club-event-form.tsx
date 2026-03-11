'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { editClubEventSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  updateClubEvent,
  togglePublishClubEvent,
} from '@/lib/actions/organizer.actions';
import { Product, ReadingClub, Event, ChangeHistoryEntry } from '@/types';
import { format } from 'date-fns';
import {
  HistoryIcon,
  EyeIcon,
  EyeOffIcon,
  SaveIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  entity: ReadingClub | Event;
  type: 'club' | 'event';
  products: Product[];
};

export default function EditClubEventForm({ entity, type, products }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showHistory, setShowHistory] = useState(false);

  const isClub = type === 'club';
  const clubData = isClub ? (entity as ReadingClub) : null;
  const eventData = !isClub ? (entity as Event) : null;

  const isActive = entity.isActive;
  const changeHistory =
    (entity.changeHistory as ChangeHistoryEntry[]) || [];

  const form = useForm<z.infer<typeof editClubEventSchema>>({
    resolver: zodResolver(editClubEventSchema),
    defaultValues: {
      title: entity.title,
      purpose: entity.purpose,
      description: entity.description,
      startDate: isClub
        ? new Date(clubData!.startDate)
        : new Date(eventData!.eventDate),
      endDate: isClub && clubData?.endDate
        ? new Date(clubData.endDate)
        : undefined,
      capacity: entity.capacity,
      format: entity.format,
      address: entity.address || '',
      onlineLink: entity.onlineLink || '',
      sessionCount: isClub ? clubData!.sessionCount : 1,
      bookIds: entity.bookIds,
    },
  });

  const watchedFormat = form.watch('format');

  const onSubmit: SubmitHandler<z.infer<typeof editClubEventSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      const result = await updateClubEvent(entity.id, type, values);

      if (result.success) {
        toast({ description: result.message });
        router.push('/user/my-clubs');
      } else {
        toast({ variant: 'destructive', description: result.message });
      }
    });
  };

  const handleTogglePublish = () => {
    startTransition(async () => {
      const result = await togglePublishClubEvent(entity.id, type);
      if (result.success) {
        toast({ description: result.message });
        router.refresh();
      } else {
        toast({ variant: 'destructive', description: result.message });
      }
    });
  };

  return (
    <div className='space-y-6'>
      {/* Top Actions */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Link href='/user/my-clubs'>
          <Button variant='ghost' className='gap-1'>
            <ArrowLeftIcon className='h-4 w-4' />
            Back to Dashboard
          </Button>
        </Link>
        <div className='flex items-center gap-4'>
          {/* Publish/Unpublish Toggle */}
          <div className='flex items-center gap-2 rounded-lg border p-3'>
            {isActive ? (
              <EyeIcon className='h-4 w-4 text-green-600' />
            ) : (
              <EyeOffIcon className='h-4 w-4 text-muted-foreground' />
            )}
            <Label htmlFor='publish-toggle' className='text-sm'>
              {isActive ? 'Published' : 'Unpublished'}
            </Label>
            <Switch
              id='publish-toggle'
              checked={isActive}
              onCheckedChange={handleTogglePublish}
              disabled={isPending}
            />
          </div>

          <Button
            variant='outline'
            className='gap-1'
            onClick={() => setShowHistory(!showHistory)}
          >
            <HistoryIcon className='h-4 w-4' />
            History ({changeHistory.length})
          </Button>
        </div>
      </div>

      {/* Change History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <HistoryIcon className='h-4 w-4' />
              Change History
            </CardTitle>
            <CardDescription>
              All modifications made to this {type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {changeHistory.length === 0 ? (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                No changes have been made yet.
              </p>
            ) : (
              <div className='space-y-3'>
                {[...changeHistory].reverse().map((entry, i) => (
                  <div
                    key={i}
                    className='flex flex-col gap-1 rounded-lg border p-3 text-sm'
                  >
                    <div className='flex items-center justify-between'>
                      <Badge variant='outline' className='capitalize'>
                        {entry.field}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>
                        {format(new Date(entry.changedAt), 'PPp')} by{' '}
                        {entry.changedBy}
                      </span>
                    </div>
                    <div className='mt-1 flex gap-2'>
                      <span className='line-through text-muted-foreground'>
                        {entry.oldValue}
                      </span>
                      <span>→</span>
                      <span className='font-medium'>{entry.newValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
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
                  {Object.entries(form.formState.errors).map(
                    ([key, error]) => (
                      <li key={key} className='text-sm text-destructive'>
                        <strong className='capitalize'>{key}:</strong>{' '}
                        {error?.message as string}
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Title */}
          <FormField
            control={form.control}
            name='title'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof editClubEventSchema>,
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
                z.infer<typeof editClubEventSchema>,
                'purpose'
              >;
            }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Input
                    placeholder='What is the main goal?'
                    {...field}
                  />
                </FormControl>
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
                z.infer<typeof editClubEventSchema>,
                'description'
              >;
            }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Detailed information...'
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
                  z.infer<typeof editClubEventSchema>,
                  'startDate'
                >;
              }) => (
                <FormItem>
                  <FormLabel>
                    {isClub ? 'Start Date' : 'Event Date'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='datetime-local'
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        field.onChange(new Date(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isClub && (
              <FormField
                control={form.control}
                name='endDate'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof editClubEventSchema>,
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
                            ? new Date(field.value)
                                .toISOString()
                                .slice(0, 16)
                            : ''
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : null,
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
                  z.infer<typeof editClubEventSchema>,
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of participants
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isClub && (
              <FormField
                control={form.control}
                name='sessionCount'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof editClubEventSchema>,
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Total meetings planned
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                    value={field.value}
                    className='flex gap-4'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='online' id='edit-online' />
                      <Label htmlFor='edit-online'>Online</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='offline'
                        id='edit-offline'
                      />
                      <Label htmlFor='edit-offline'>Offline</Label>
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
                  z.infer<typeof editClubEventSchema>,
                  'address'
                >;
              }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Full venue address'
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
                  z.infer<typeof editClubEventSchema>,
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
                              <h4 className='font-medium'>
                                {product.name}
                              </h4>
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

          {/* Submit */}
          <div className='flex gap-4'>
            <Link href='/user/my-clubs'>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </Link>
            <Button type='submit' disabled={isPending} className='gap-1'>
              <SaveIcon className='h-4 w-4' />
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
