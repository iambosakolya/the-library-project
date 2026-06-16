'use client';

import Image from 'next/image';
import { Button } from '../../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { AlertCircle } from 'lucide-react';
import { submissionFormStyles } from './styles';
import { CatalogSearchAlertProps } from '../shared/types';

export default function CatalogSearchAlert({
  catalogSearchResults,
  onDismiss,
}: CatalogSearchAlertProps) {
  return (
    <Alert className={submissionFormStyles.alertSection}>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Similar books found in catalog</AlertTitle>
      <AlertDescription>
        <div className={submissionFormStyles.alertBooksList}>
          {catalogSearchResults.slice(0, 3).map((book) => (
            <div key={book.id} className={submissionFormStyles.alertBookRow}>
              {book.images?.[0] && (
                <Image
                  src={book.images[0]}
                  alt={book.name}
                  width={40}
                  height={60}
                  className={submissionFormStyles.alertBookImage}
                />
              )}
              <div>
                <p className={submissionFormStyles.alertBookTitle}>
                  {book.name}
                </p>
                <p className={submissionFormStyles.alertBookAuthor}>
                  {book.author}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant='link'
          size='sm'
          className={submissionFormStyles.continueLink}
          onClick={onDismiss}
        >
          Continue anyway
        </Button>
      </AlertDescription>
    </Alert>
  );
}
