'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { productDefaultValues } from '@/lib/constants';
import { productInsertSchema, updateProductSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Product } from '@/types';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { X } from 'lucide-react';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultIsForSale =
    product && type === 'Update' ? Number(product.price) > 0 : false;
  const [isForSale, setIsForSale] = useState(defaultIsForSale);

  const form = useForm<z.infer<typeof productInsertSchema>>({
    resolver: zodResolver(
      type === 'Create' ? productInsertSchema : updateProductSchema,
    ),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof productInsertSchema>> = async (
    values,
  ) => {
    // If not for sale, set price to 0
    if (!isForSale) {
      values.price = '0';
    }

    // On Create - admin-added books are published immediately without approval
    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: 'Book added successfully — published immediately.',
        });
        router.push('/admin/products');
      }
    }

    // On Update
    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }
    }
  };

  const images = form.watch('images');

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertSchema>,
                'name'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertSchema>,
                'slug'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Enter slug' {...field} />
                    <Button
                      type='button'
                      className='mt-2 bg-gray-500 px-4 py-1 text-white hover:bg-gray-600'
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true }),
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertSchema>,
                'category'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*  author */}
          <FormField
            control={form.control}
            name='author'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertSchema>,
                'author'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder='Enter author' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Is for sale toggle */}
        <div className='flex items-center gap-3'>
          <Checkbox
            id='isForSale'
            checked={isForSale}
            onCheckedChange={(checked) => {
              setIsForSale(checked === true);
              if (!checked) {
                form.setValue('price', '0');
              }
            }}
          />
          <label
            htmlFor='isForSale'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            This book is for sale
          </label>
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Price - only shown if for sale */}
          {isForSale && (
            <FormField
              control={form.control}
              name='price'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof productInsertSchema>,
                  'price'
                >;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter product price' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertSchema>,
                'stock'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder='Enter stock' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field flex flex-col gap-5 md:flex-row'>
          {/* Images */}
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='mt-2 min-h-48 space-y-2'>
                    {/* Image preview grid */}
                    {images.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {images.map((image: string) => (
                          <div key={image} className='group relative'>
                            <Image
                              src={image}
                              alt='product image'
                              className='h-20 w-20 rounded-sm object-cover object-center'
                              width={100}
                              height={100}
                            />
                            <button
                              type='button'
                              className='absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100'
                              onClick={() => {
                                form.setValue(
                                  'images',
                                  images.filter((img: string) => img !== image),
                                );
                              }}
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Upload button */}
                    <FormControl>
                      <UploadButton
                        endpoint='imageUploader'
                        onClientUploadComplete={(res) => {
                          const newUrls = res.map((file) => file.url);
                          form.setValue('images', [...images, ...newUrls]);
                          toast({
                            description: `${res.length} image(s) uploaded successfully`,
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: 'destructive',
                            description: `ERROR! ${error.message}`,
                          });
                        }}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field'>{/* isFeatured */}</div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertSchema>,
                'description'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
