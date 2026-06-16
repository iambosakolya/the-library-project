'use client';

import Image from 'next/image';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { UploadDropzone } from '@/lib/uploadthing';
import { useToast } from '@/hooks/use-toast';
import { submissionFormStyles } from './styles';
import { CoverImageUploadProps } from '../shared/types';

export default function CoverImageUpload({
  form,
  watchedCoverImage,
}: CoverImageUploadProps) {
  const { toast } = useToast();

  return (
    <FormField
      control={form.control}
      name='coverImage'
      render={() => (
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          <Card>
            <CardContent className={submissionFormStyles.coverContent}>
              {!!watchedCoverImage && (
                <div className={submissionFormStyles.coverPreview}>
                  <Image
                    src={watchedCoverImage}
                    alt='Book cover'
                    className={submissionFormStyles.coverImage}
                    width={120}
                    height={160}
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    onClick={() => form.setValue('coverImage', '')}
                  >
                    Remove
                  </Button>
                </div>
              )}
              {!watchedCoverImage && (
                <FormControl>
                  <UploadDropzone
                    endpoint='imageUploader'
                    onClientUploadComplete={(res) => {
                      form.setValue('coverImage', res[0].url);
                      toast({
                        description: 'Image uploaded successfully',
                      });
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        variant: 'destructive',
                        description: `Upload error: ${error.message}`,
                      });
                    }}
                  />
                </FormControl>
              )}
            </CardContent>
          </Card>
          <FormDescription>
            Upload a cover image or one will be auto-filled from Google Books
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
