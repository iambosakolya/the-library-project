'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { bookSubmissionDefaultValues, BOOK_GENRES, BOOK_LANGUAGES } from '@/lib/constants';
import { bookSubmissionSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createBookSubmission, searchAuthors, searchCatalog } from '@/lib/actions/book-submission.actions';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Search, Loader2, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { searchBookByISBN, searchBookByTitleAndAuthor, ParsedBookData, detectLanguageFromTitle } from '@/lib/google-books';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface CatalogBook {
  id: string;
  name: string;
  author: string;
  images?: string[];
  slug: string;
}

const BookSubmissionForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isbnLookupLoading, setIsbnLookupLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);
  const [catalogSearchResults, setCatalogSearchResults] = useState<CatalogBook[]>([]);
  const [googleBooksResults, setGoogleBooksResults] = useState<ParsedBookData[]>([]);
  const [showCatalogSearch, setShowCatalogSearch] = useState(true);
  const [showGoogleResults, setShowGoogleResults] = useState(false);

  const form = useForm<z.infer<typeof bookSubmissionSchema>>({
    resolver: zodResolver(bookSubmissionSchema),
    defaultValues: bookSubmissionDefaultValues,
  });

  const watchedTitle = form.watch('title');
  const watchedAuthor = form.watch('author');
  const watchedIsbn = form.watch('isbn');
  const watchedCategories = form.watch('categories');
  const watchedCoverImage = form.watch('coverImage');

  // Auto-detect language from title
  useEffect(() => {
    if (watchedTitle && !form.getValues('language')) {
      const detectedLang = detectLanguageFromTitle(watchedTitle);
      form.setValue('language', detectedLang);
    }
  }, [watchedTitle, form]);

  // Search catalog for duplicates
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (watchedTitle && watchedTitle.length >= 3 && showCatalogSearch) {
        const result = await searchCatalog(watchedTitle);
        if (result.success && result.data) {
          setCatalogSearchResults(result.data);
        }
      } else {
        setCatalogSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedTitle, showCatalogSearch]);

  // Author autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (watchedAuthor && watchedAuthor.length >= 2) {
        const result = await searchAuthors(watchedAuthor);
        if (result.success && result.data) {
          setAuthorSuggestions(result.data);
        }
      } else {
        setAuthorSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [watchedAuthor]);

  // ISBN Lookup
  const handleIsbnLookup = async () => {
    if (!watchedIsbn) {
      toast({
        variant: 'destructive',
        description: 'Please enter an ISBN to lookup',
      });
      return;
    }

    setIsbnLookupLoading(true);
    try {
      const bookData = await searchBookByISBN(watchedIsbn);
      
      if (bookData) {
        // Prefill form with Google Books data
        form.setValue('title', bookData.title);
        form.setValue('author', bookData.author);
        form.setValue('isbn13', bookData.isbn13 || '');
        form.setValue('publisher', bookData.publisher || '');
        form.setValue('publishedDate', bookData.publishedDate || '');
        form.setValue('description', bookData.description);
        form.setValue('pageCount', bookData.pageCount || null);
        form.setValue('language', bookData.language || '');
        form.setValue('categories', bookData.categories.length > 0 ? bookData.categories : ['Other']);
        form.setValue('coverImage', bookData.coverImage || '');
        form.setValue('thumbnailImage', bookData.thumbnailImage || '');
        form.setValue('previewLink', bookData.previewLink || '');
        form.setValue('googleBooksId', bookData.googleBooksId);

        toast({
          description: 'Book information loaded from Google Books!',
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'No book found with this ISBN. You can still fill in the details manually.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        description: 'Error looking up ISBN. Please try again.',
      });
    } finally {
      setIsbnLookupLoading(false);
    }
  };

  // Search Google Books
  const handleGoogleBooksSearch = async () => {
    if (!watchedTitle) {
      toast({
        variant: 'destructive',
        description: 'Please enter a title to search',
      });
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchBookByTitleAndAuthor(watchedTitle, watchedAuthor || undefined);
      setGoogleBooksResults(results);
      setShowGoogleResults(true);
      
      if (results.length === 0) {
        toast({
          description: 'No results found on Google Books',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        description: 'Error searching Google Books',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Select a book from Google Books results
  const handleSelectGoogleBook = (bookData: ParsedBookData) => {
    form.setValue('title', bookData.title);
    form.setValue('author', bookData.author);
    form.setValue('isbn', bookData.isbn || '');
    form.setValue('isbn13', bookData.isbn13 || '');
    form.setValue('publisher', bookData.publisher || '');
    form.setValue('publishedDate', bookData.publishedDate || '');
    form.setValue('description', bookData.description);
    form.setValue('pageCount', bookData.pageCount || null);
    form.setValue('language', bookData.language || '');
    form.setValue('categories', bookData.categories.length > 0 ? bookData.categories : ['Other']);
    form.setValue('coverImage', bookData.coverImage || '');
    form.setValue('thumbnailImage', bookData.thumbnailImage || '');
    form.setValue('previewLink', bookData.previewLink || '');
    form.setValue('googleBooksId', bookData.googleBooksId);

    setShowGoogleResults(false);
    toast({
      description: 'Book information loaded!',
    });
  };

  const onSubmit: SubmitHandler<z.infer<typeof bookSubmissionSchema>> = async (values) => {
    setIsSubmitting(true);
    try {
      const res = await createBookSubmission(values);

      if (res.success) {
        toast({
          description: res.message,
        });
        router.push('/user/book-submissions');
      } else {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategory = (category: string) => {
    const currentCategories = form.getValues('categories') || [];
    if (!currentCategories.includes(category)) {
      form.setValue('categories', [...currentCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    const currentCategories = form.getValues('categories') || [];
    form.setValue(
      'categories',
      currentCategories.filter((c) => c !== category),
    );
  };

  return (
    <div className='mx-auto max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-6 w-6' />
            Submit a New Book
          </CardTitle>
          <CardDescription>
            Can not find a book in our catalog? Submit it here and we will add it after review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Catalog search results */}
          {catalogSearchResults.length > 0 && showCatalogSearch && (
            <Alert className='mb-6'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Similar books found in catalog</AlertTitle>
              <AlertDescription>
                <div className='mt-2 space-y-2'>
                  {catalogSearchResults.slice(0, 3).map((book) => (
                    <div key={book.id} className='flex items-center gap-2 text-sm'>
                      {book.images?.[0] && (
                        <Image
                          src={book.images[0]}
                          alt={book.name}
                          width={40}
                          height={60}
                          className='rounded object-cover'
                        />
                      )}
                      <div>
                        <p className='font-medium'>{book.name}</p>
                        <p className='text-muted-foreground'>{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant='link'
                  size='sm'
                  className='mt-2 p-0'
                  onClick={() => setShowCatalogSearch(false)}
                >
                  Continue anyway
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* ISBN Lookup Section */}
              <Card className='border-dashed'>
                <CardHeader>
                  <CardTitle className='text-base'>Quick Fill with ISBN</CardTitle>
                  <CardDescription>
                    Enter an ISBN to automatically fill book details from Google Books
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex gap-2'>
                    <FormField
                      control={form.control}
                      name='isbn'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input placeholder='Enter ISBN (10 or 13 digits)' {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='button'
                      onClick={handleIsbnLookup}
                      disabled={isbnLookupLoading || !watchedIsbn}
                    >
                      {isbnLookupLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Search className='h-4 w-4' />
                      )}
                      <span className='ml-2'>Lookup</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Google Books Search */}
              <Card className='border-dashed'>
                <CardHeader>
                  <CardTitle className='text-base'>Or Search Google Books</CardTitle>
                  <CardDescription>
                    Search by title and author to find your book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleGoogleBooksSearch}
                    disabled={searchLoading || !watchedTitle}
                    className='w-full'
                  >
                    {searchLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Search className='mr-2 h-4 w-4' />
                    )}
                    Search Google Books
                  </Button>

                  {/* Google Books Results */}
                  {showGoogleResults && googleBooksResults.length > 0 && (
                    <div className='mt-4 space-y-2'>
                      <p className='text-sm font-medium'>Select a book:</p>
                      {googleBooksResults.map((book) => (
                        <button
                          type='button'
                          key={book.googleBooksId}
                          className='flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition hover:bg-accent'
                          onClick={() => handleSelectGoogleBook(book)}
                        >
                          {book.thumbnailImage && (
                            <Image
                              src={book.thumbnailImage}
                              alt={book.title}
                              width={50}
                              height={75}
                              className='rounded object-cover'
                            />
                          )}
                          <div className='flex-1'>
                            <p className='font-medium'>{book.title}</p>
                            <p className='text-sm text-muted-foreground'>{book.author}</p>
                            {book.publishedDate && (
                              <p className='text-xs text-muted-foreground'>{book.publishedDate}                            </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Book Details</h3>

                {/* Title */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter book title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Author with autocomplete */}
                <FormField
                  control={form.control}
                  name='author'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author *</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input placeholder='Enter author name' {...field} />
                          {authorSuggestions.length > 0 && (
                            <Card className='absolute z-10 mt-1 w-full'>
                              <CardContent className='p-2'>
                                {authorSuggestions.map((author) => (
                                  <button
                                    type='button'
                                    key={author}
                                    className='w-full cursor-pointer rounded p-2 text-left hover:bg-accent'
                                    onClick={() => {
                                      form.setValue('author', author);
                                      setAuthorSuggestions([]);
                                    }}
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

                {/* ISBN-13 */}
                <FormField
                  control={form.control}
                  name='isbn13'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN-13</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter ISBN-13' {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Publisher and Published Date */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='publisher'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter publisher' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='publishedDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Published Date</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g., 2023, 2023-01, 2023-01-15' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter book description'
                          className='min-h-32 resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 2000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Page Count and Language */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='pageCount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Count</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter page count'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select language' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BOOK_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Categories */}
                <FormField
                  control={form.control}
                  name='categories'
                  render={() => (
                    <FormItem>
                      <FormLabel>Categories / Genres *</FormLabel>
                      <Select onValueChange={addCategory}>
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
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {watchedCategories?.map((category) => (
                          <Badge key={category} variant='secondary'>
                            {category}
                            <button
                              type='button'
                              className='ml-1'
                              onClick={() => removeCategory(category)}
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormDescription>Select at least one category</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover Image Upload */}
                <FormField
                  control={form.control}
                  name='coverImage'
                  render={() => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <Card>
                        <CardContent className='mt-2 min-h-32 space-y-2'>
                          {watchedCoverImage && (
                            <div className='flex items-center gap-4'>
                              <Image
                                src={watchedCoverImage}
                                alt='Book cover'
                                className='h-40 w-auto rounded-md object-cover'
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
                              <UploadButton
                                endpoint='imageUploader'
                                onClientUploadComplete={(res: { url: string }[]) => {
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
              </div>

              {/* Submit Button */}
              <div className='flex gap-4'>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isSubmitting}
                  className='flex-1'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className='mr-2 h-4 w-4' />
                      Submit Book for Review
                    </>
                  )}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='lg'
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookSubmissionForm;
