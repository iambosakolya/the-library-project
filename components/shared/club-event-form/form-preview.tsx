'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { previewStyles } from './styles';
import { type FormPreviewProps } from '../shared/types'

export default function FormPreview({
  values,
  selectedBooks,
  onBack,
  onSubmit,
  isSubmitting,
}: FormPreviewProps) {
  return (
    <Card className={previewStyles.wrapper}>
      <CardHeader>
        <CardTitle>
          Preview Your {values.type === 'club' ? 'Reading Club' : 'Event'}
        </CardTitle>
        <CardDescription>
          Review your submission before sending it for approval
        </CardDescription>
      </CardHeader>
      <CardContent className={previewStyles.content}>
        <div>
          <h3 className={previewStyles.sectionTitle}>Type</h3>
          <p className='capitalize'>{values.type}</p>
        </div>
        <div>
          <h3 className={previewStyles.sectionTitle}>Title</h3>
          <p>{values.title}</p>
        </div>
        <div>
          <h3 className={previewStyles.sectionTitle}>Purpose</h3>
          <p>{values.purpose}</p>
        </div>
        <div>
          <h3 className={previewStyles.sectionTitle}>Description</h3>
          <p className='whitespace-pre-wrap'>{values.description}</p>
        </div>
        <div className={previewStyles.gridTwo}>
          <div>
            <h3 className={previewStyles.sectionTitle}>Start Date</h3>
            <p>
              {values.startDate
                ? new Date(values.startDate).toLocaleDateString()
                : 'Not set'}
            </p>
          </div>
          {values.type === 'club' && values.endDate && (
            <div>
              <h3 className={previewStyles.sectionTitle}>End Date</h3>
              <p>{new Date(values.endDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
        <div className={previewStyles.gridTwo}>
          <div>
            <h3 className={previewStyles.sectionTitle}>Capacity</h3>
            <p>{values.capacity} people</p>
          </div>
          <div>
            <h3 className={previewStyles.sectionTitle}>Session Count</h3>
            <p>{values.sessionCount} sessions</p>
          </div>
        </div>
        <div>
          <h3 className={previewStyles.sectionTitle}>Format</h3>
          <p className='capitalize'>{values.format}</p>
        </div>
        {values.format === 'offline' && values.address && (
          <div>
            <h3 className={previewStyles.sectionTitle}>Address</h3>
            <p>{values.address}</p>
          </div>
        )}
        {values.format === 'online' && values.onlineLink && (
          <div>
            <h3 className={previewStyles.sectionTitle}>Online Link</h3>
            <p className='break-all'>{values.onlineLink}</p>
          </div>
        )}
        <div>
          <h3 className={previewStyles.sectionTitle}>Selected Books</h3>
          <ul className={previewStyles.bookList}>
            {selectedBooks.map((book) => (
              <li key={book.id} className={previewStyles.bookItem}>
                <span className={previewStyles.bookName}>{book.name}</span>
                <span className={previewStyles.bookAuthor}>by {book.author}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={previewStyles.actionsRow}>
          <Button type='button' variant='outline' onClick={onBack}>
            Back to Edit
          </Button>
          <Button type='button' onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
