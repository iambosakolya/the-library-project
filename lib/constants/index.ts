export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'The Library Project';

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Web application for the book shop using Next.js';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const shippingDetailesDefault = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
};

// Book genres/categories
export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery & Thriller',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Historical Fiction',
  'Biography & Autobiography',
  'Self-Help',
  'Business & Economics',
  'Science & Technology',
  'History',
  'Philosophy',
  'Poetry',
  'Drama',
  'Horror',
  'Young Adult',
  'Children\'s Books',
  'Comics & Graphic Novels',
  'Cookbooks',
  'Travel',
  'Art & Photography',
  'Religion & Spirituality',
  'Education',
  'Psychology',
  'True Crime',
  'Health & Wellness',
  'Politics & Social Sciences',
  'Essays',
  'Literary Fiction',
  'Other',
] as const;

// Languages
export const BOOK_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'other', name: 'Other' },
] as const;

export const bookSubmissionDefaultValues = {
  title: '',
  author: '',
  isbn: '',
  isbn13: '',
  publisher: '',
  publishedDate: '',
  description: '',
  pageCount: null,
  language: '',
  categories: [],
  coverImage: '',
  thumbnailImage: '',
  previewLink: '',
  googleBooksId: '',
};