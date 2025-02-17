'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { Shipping } from '@/types';
import { shippingSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { shippingDetailesDefault } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ShippingForm = ({ address }: { address: Shipping }) => {
  const router = useRouter();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: address || shippingDetailesDefault,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }
      router.push('/payment-method');
    });
  };

  return (
    <>
      <div className='mx-auto max-w-md space-y-4'>
        <h1 className='h2-bold mt-4'>Shipping detailes</h1>
        <p className='text-sm text-muted-foreground'>
          Please enter your address and detailes to ship to
        </p>
        <Form {...form}>
          <form
            method='post'
            className='space-y-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='fullName'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingSchema>,
                    'fullName'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='streetAddress'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingSchema>,
                    'streetAddress'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='city'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingSchema>,
                    'city'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your city' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingSchema>,
                    'postalCode'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Postal code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your postal code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='country'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingSchema>,
                    'country'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your country' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-2'>
              <Button type='submit' disabled={isPending}>
                Continue
                {isPending ? (
                  <Loader className='h-4 w-4 animate-spin' />
                ) : (
                  <ArrowRight className='h-4 w-4 animate-bounce' />
                )}{' '}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingForm;
