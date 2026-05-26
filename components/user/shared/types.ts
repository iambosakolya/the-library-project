import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { bookSubmissionSchema } from '@/lib/validators';
import { ParsedBookData } from '@/lib/google-books';

export interface BookContext {
  title: string;
  author: string;
  categories: string[];
  language?: string;
  publishedDate?: string;
  pageCount?: number | null;
  publisher?: string;
}

export interface AIDescriptionGeneratorProps {
  book: BookContext;
  currentDescription: string;
  onApply: (text: string) => void;
}

export interface CatalogBook {
  id: string;
  name: string;
  author: string;
  images?: string[];
  slug: string;
}

export interface IsbnLookupSectionProps {
  form: UseFormReturn<z.infer<typeof bookSubmissionSchema>>;
  isbnLookupLoading: boolean;
  watchedIsbn: string | null | undefined;
  onLookup: () => void;
}

export interface GoogleBooksSearchSectionProps {
  searchLoading: boolean;
  watchedTitle: string;
  showGoogleResults: boolean;
  googleBooksResults: ParsedBookData[];
  onSearch: () => void;
  onSelectBook: (book: ParsedBookData) => void;
}

export interface SaleSectionProps {
  form: UseFormReturn<z.infer<typeof bookSubmissionSchema>>;
  watchedIsForSale: boolean;
}

export interface CatalogSearchAlertProps {
  catalogSearchResults: CatalogBook[];
  onDismiss: () => void;
}

export interface AuthorFieldProps {
  form: UseFormReturn<z.infer<typeof bookSubmissionSchema>>;
  authorSuggestions: string[];
  onSelectAuthor: (author: string) => void;
}

export interface CategoriesSelectorProps {
  form: UseFormReturn<z.infer<typeof bookSubmissionSchema>>;
  watchedCategories: string[] | undefined;
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
}

export interface CoverImageUploadProps {
  form: UseFormReturn<z.infer<typeof bookSubmissionSchema>>;
  watchedCoverImage: string | null | undefined;
}

export interface SubmitActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export type DescriptionTone = 'casual' | 'academic' | 'promotional';
export type DescriptionLength = 'short' | 'medium' | 'long';
export type GenerateMode = 'generate' | 'improve';

export interface OptionsPanelProps {
  tone: DescriptionTone;
  length: DescriptionLength;
  targetLanguage: string;
  onToneChange: (tone: DescriptionTone) => void;
  onLengthChange: (length: DescriptionLength) => void;
  onLanguageChange: (lang: string) => void;
}

export interface GenerationPreviewProps {
  generatedText: string;
  isGenerating: boolean;
  onRegenerate: () => void;
  onApply: () => void;
}
