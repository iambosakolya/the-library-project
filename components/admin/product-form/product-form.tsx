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
} from '@/components/ui/form';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { X } from 'lucide-react';
import { productFormStyles as styles } from './styles';

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
    if (!isForSale) {
      values.price = '0';
    }

    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({
          description: 'Book added successfully — published immediately.',
        });
        router.push('/admin/products');
      }
    }

    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({ description: res.message });
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
        className={styles.form}
      >
        <div className={styles.fieldRow}>
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
              <FormItem className={styles.fieldFull}>
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
              <FormItem className={styles.fieldFull}>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Enter slug' {...field} />
                    <Button
                      type='button'
                      className={styles.generateSlugBtn}
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
        <div className={styles.fieldRow}>
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
              <FormItem className={styles.fieldFull}>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Author */}
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
              <FormItem className={styles.fieldFull}>
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
        <div className={styles.saleToggle}>
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
          <label htmlFor='isForSale' className={styles.saleLabel}>
            This book is for sale
          </label>
        </div>

        <div className={styles.fieldRow}>
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
                <FormItem className={styles.fieldFull}>
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
              <FormItem className={styles.fieldFull}>
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
              <FormItem className={styles.fieldFull}>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className={styles.imageCard}>
                    {/* Image preview grid */}
                    {images.length > 0 && (
                      <div className={styles.imageGrid}>
                        {images.map((image: string) => (
                          <div key={image} className={styles.imageWrapper}>
                            <Image
                              src={image}
                              alt='product image'
                              className={styles.image}
                              width={100}
                              height={100}
                            />
                            <button
                              type='button'
                              className={styles.imageRemoveBtn}
                              onClick={() => {
                                form.setValue(
                                  'images',
                                  images.filter((img: string) => img !== image),
                                );
                              }}
                            >
                              <X className={styles.imageRemoveIcon} />
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
              <FormItem className={styles.fieldFull}>
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
            className={styles.submitButton}
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
