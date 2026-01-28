// Google Books API integration for fetching book information

export interface GoogleBookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBookItem[];
}

export interface ParsedBookData {
  title: string;
  author: string;
  isbn?: string;
  isbn13?: string;
  publisher?: string;
  publishedDate?: string;
  description: string;
  pageCount?: number;
  language?: string;
  categories: string[];
  coverImage?: string;
  thumbnailImage?: string;
  previewLink?: string;
  googleBooksId: string;
}

const GOOGLE_BOOKS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search books by ISBN
 */
export async function searchBookByISBN(
  isbn: string,
): Promise<ParsedBookData | null> {
  try {
    const cleanedISBN = isbn.replace(/[-\s]/g, '');
    const url = `${GOOGLE_BOOKS_BASE_URL}?q=isbn:${cleanedISBN}${GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    return parseGoogleBookItem(data.items[0]);
  } catch (error) {
    console.error('Error searching book by ISBN:', error);
    return null;
  }
}

/**
 * Search books by title and author
 */
export async function searchBookByTitleAndAuthor(
  title: string,
  author?: string,
): Promise<ParsedBookData[]> {
  try {
    let query = `intitle:${encodeURIComponent(title)}`;
    if (author) {
      query += `+inauthor:${encodeURIComponent(author)}`;
    }

    const url = `${GOOGLE_BOOKS_BASE_URL}?q=${query}${GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ''}&maxResults=10`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(parseGoogleBookItem);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

/**
 * Get book by Google Books ID
 */
export async function getBookByGoogleId(
  googleId: string,
): Promise<ParsedBookData | null> {
  try {
    const url = `${GOOGLE_BOOKS_BASE_URL}/${googleId}${GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data: GoogleBookItem = await response.json();
    return parseGoogleBookItem(data);
  } catch (error) {
    console.error('Error getting book by Google ID:', error);
    return null;
  }
}

/**
 * Parse Google Book item to our format
 */
function parseGoogleBookItem(item: GoogleBookItem): ParsedBookData {
  const volumeInfo = item.volumeInfo;

  // Extract ISBNs
  let isbn: string | undefined;
  let isbn13: string | undefined;

  if (volumeInfo.industryIdentifiers) {
    for (const identifier of volumeInfo.industryIdentifiers) {
      if (identifier.type === 'ISBN_10') {
        isbn = identifier.identifier;
      } else if (identifier.type === 'ISBN_13') {
        isbn13 = identifier.identifier;
      }
    }
  }

  // Get the best quality image
  let coverImage: string | undefined;
  let thumbnailImage: string | undefined;

  if (volumeInfo.imageLinks) {
    // Prefer higher quality images
    coverImage =
      volumeInfo.imageLinks.extraLarge ||
      volumeInfo.imageLinks.large ||
      volumeInfo.imageLinks.medium ||
      volumeInfo.imageLinks.small ||
      volumeInfo.imageLinks.thumbnail;

    thumbnailImage =
      volumeInfo.imageLinks.smallThumbnail || volumeInfo.imageLinks.thumbnail;

    // Replace http with https for security
    if (coverImage) coverImage = coverImage.replace('http://', 'https://');
    if (thumbnailImage)
      thumbnailImage = thumbnailImage.replace('http://', 'https://');
  }

  return {
    title: volumeInfo.title + (volumeInfo.subtitle ? `: ${volumeInfo.subtitle}` : ''),
    author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
    isbn,
    isbn13,
    publisher: volumeInfo.publisher,
    publishedDate: volumeInfo.publishedDate,
    description: volumeInfo.description || 'No description available',
    pageCount: volumeInfo.pageCount,
    language: volumeInfo.language,
    categories: volumeInfo.categories || [],
    coverImage,
    thumbnailImage,
    previewLink: volumeInfo.previewLink,
    googleBooksId: item.id,
  };
}

/**
 * Detect language from title (basic implementation)
 * This is a simple heuristic - for production, consider using a proper language detection library
 */
export function detectLanguageFromTitle(title: string): string {
  // Check for common non-English characters
  const hasCyrillic = /[\u0400-\u04FF]/.test(title);
  const hasChinese = /[\u4E00-\u9FFF]/.test(title);
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(title);
  const hasKorean = /[\uAC00-\uD7AF]/.test(title);
  const hasArabic = /[\u0600-\u06FF]/.test(title);

  if (hasCyrillic) return 'ru';
  if (hasChinese) return 'zh';
  if (hasJapanese) return 'ja';
  if (hasKorean) return 'ko';
  if (hasArabic) return 'ar';

  // Default to English
  return 'en';
}
