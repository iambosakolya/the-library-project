'use client';

import Image from 'next/image';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Search, Loader2 } from 'lucide-react';
import { submissionFormStyles } from './styles';
import { GoogleBooksSearchSectionProps } from '../shared/types';

export default function GoogleBooksSearchSection({
  searchLoading,
  watchedTitle,
  showGoogleResults,
  googleBooksResults,
  onSearch,
  onSelectBook,
}: GoogleBooksSearchSectionProps) {
  return (
    <Card className={submissionFormStyles.sectionCard}>
      <CardHeader>
        <CardTitle className={submissionFormStyles.sectionCardTitle}>
          Or Search Google Books
        </CardTitle>
        <CardDescription>
          Search by title and author to find your book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type='button'
          variant='outline'
          onClick={onSearch}
          disabled={searchLoading || !watchedTitle}
          className={submissionFormStyles.searchButton}
        >
          {searchLoading ? (
            <Loader2 className={submissionFormStyles.searchIconSpin} />
          ) : (
            <Search className={submissionFormStyles.searchIcon} />
          )}
          Search Google Books
        </Button>

        {/* Google Books Results */}
        {showGoogleResults && googleBooksResults.length > 0 && (
          <div className={submissionFormStyles.googleResults}>
            <p className={submissionFormStyles.googleResultsLabel}>
              Select a book:
            </p>
            {googleBooksResults.map((book) => (
              <button
                type='button'
                key={book.googleBooksId}
                className={submissionFormStyles.googleResultItem}
                onClick={() => onSelectBook(book)}
              >
                {book.thumbnailImage && (
                  <Image
                    src={book.thumbnailImage}
                    alt={book.title}
                    width={50}
                    height={75}
                    className={submissionFormStyles.googleResultImage}
                  />
                )}
                <div className={submissionFormStyles.googleResultInfo}>
                  <p className={submissionFormStyles.googleResultTitle}>
                    {book.title}
                  </p>
                  <p className={submissionFormStyles.googleResultAuthor}>
                    {book.author}
                  </p>
                  {book.publishedDate && (
                    <p className={submissionFormStyles.googleResultDate}>
                      {book.publishedDate}{' '}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
