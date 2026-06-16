'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { bookSubmissionDefaultValues, BOOK_LANGUAGES } from '@/lib/constants';
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
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  createBookSubmission,
  searchAuthors,
  searchCatalog,
} from '@/lib/actions/book-submission.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { BookOpen } from 'lucide-react';
import {
  searchBookByISBN,
  searchBookByTitleAndAuthor,
  ParsedBookData,
  detectLanguageFromTitle,
} from '@/lib/google-books';
import AIDescriptionGenerator from '../ai-description-generator/ai-description-generator';
import IsbnLookupSection from './isbn-lookup-section';
import GoogleBooksSearchSection from './google-books-search-section';
import SaleSection from './sale-section';
import CatalogSearchAlert from './catalog-search-alert';
import AuthorField from './author-field';
import CategoriesSelector from './categories-selector';
import CoverImageUpload from './cover-image-upload';
import SubmitActions from './submit-actions';
import { submissionFormStyles } from './styles';
import { CatalogBook } from '../shared/types';

const BookSubmissionForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isbnLookupLoading, setIsbnLookupLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);
  const [catalogSearchResults, setCatalogSearchResults] = useState<
    CatalogBook[]
  >([]);
  const [googleBooksResults, setGoogleBooksResults] = useState<
    ParsedBookData[]
  >([]);
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
  const watchedIsForSale = form.watch('isForSale');
  const watchedDescription = form.watch('description');
  const watchedLanguage = form.watch('language');

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
        form.setValue(
          'categories',
          bookData.categories.length > 0 ? bookData.categories : ['Other'],
        );
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
          description:
            'No book found with this ISBN. You can still fill in the details manually.',
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
      const results = await searchBookByTitleAndAuthor(
        watchedTitle,
        watchedAuthor || undefined,
      );
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
    form.setValue(
      'categories',
      bookData.categories.length > 0 ? bookData.categories : ['Other'],
    );
    form.setValue('coverImage', bookData.coverImage || '');
    form.setValue('thumbnailImage', bookData.thumbnailImage || '');
    form.setValue('previewLink', bookData.previewLink || '');
    form.setValue('googleBooksId', bookData.googleBooksId);

    setShowGoogleResults(false);
    toast({
      description: 'Book information loaded!',
    });
  };

  const onSubmit: SubmitHandler<z.infer<typeof bookSubmissionSchema>> = async (
    values,
  ) => {
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
        description:
          error instanceof Error ? error.message : 'An error occurred',
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
    <div className={submissionFormStyles.wrapper}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className={submissionFormStyles.headerIcon} />
            Submit a New Book
          </CardTitle>
          <CardDescription>
            Can not find a book in our catalog? Submit it here and we will add
            it after review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Catalog search results */}
          {catalogSearchResults.length > 0 && showCatalogSearch && (
            <CatalogSearchAlert
              catalogSearchResults={catalogSearchResults}
              onDismiss={() => setShowCatalogSearch(false)}
            />
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={submissionFormStyles.formContainer}
            >
              {/* ISBN Lookup Section */}
              <IsbnLookupSection
                form={form}
                isbnLookupLoading={isbnLookupLoading}
                watchedIsbn={watchedIsbn}
                onLookup={handleIsbnLookup}
              />

              {/* Google Books Search */}
              <GoogleBooksSearchSection
                searchLoading={searchLoading}
                watchedTitle={watchedTitle}
                showGoogleResults={showGoogleResults}
                googleBooksResults={googleBooksResults}
                onSearch={handleGoogleBooksSearch}
                onSelectBook={handleSelectGoogleBook}
              />

              <div className={submissionFormStyles.detailsSection}>
                <h3 className={submissionFormStyles.sectionTitle}>
                  Book Details
                </h3>

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
                <AuthorField
                  form={form}
                  authorSuggestions={authorSuggestions}
                  onSelectAuthor={(author) => {
                    form.setValue('author', author);
                    setAuthorSuggestions([]);
                  }}
                />

                {/* ISBN-13 */}
                <FormField
                  control={form.control}
                  name='isbn13'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN-13</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter ISBN-13'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Publisher and Published Date */}
                <div className={submissionFormStyles.gridTwoCols}>
                  <FormField
                    control={form.control}
                    name='publisher'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter publisher'
                            {...field}
                            value={field.value || ''}
                          />
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
                          <Input
                            placeholder='e.g., 2023, 2023-01, 2023-01-15'
                            {...field}
                            value={field.value || ''}
                          />
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
                          className={submissionFormStyles.descriptionTextarea}
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

                {/* AI Description Generator */}
                <AIDescriptionGenerator
                  book={{
                    title: watchedTitle,
                    author: watchedAuthor,
                    categories: watchedCategories || [],
                    language: watchedLanguage || undefined,
                    publishedDate: form.getValues('publishedDate') || undefined,
                    pageCount: form.getValues('pageCount'),
                    publisher: form.getValues('publisher') || undefined,
                  }}
                  currentDescription={watchedDescription || ''}
                  onApply={(text) =>
                    form.setValue('description', text, { shouldValidate: true })
                  }
                />

                {/* Page Count and Language */}
                <div className={submissionFormStyles.gridTwoCols}>
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
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
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
                <CategoriesSelector
                  form={form}
                  watchedCategories={watchedCategories}
                  onAddCategory={addCategory}
                  onRemoveCategory={removeCategory}
                />

                {/* Cover Image Upload */}
                <CoverImageUpload
                  form={form}
                  watchedCoverImage={watchedCoverImage}
                />

                {/* For Sale Section */}
                <SaleSection form={form} watchedIsForSale={watchedIsForSale} />
              </div>

              {/* Submit Button */}
              <SubmitActions
                isSubmitting={isSubmitting}
                onCancel={() => router.back()}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookSubmissionForm;
