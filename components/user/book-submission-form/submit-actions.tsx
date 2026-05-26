'use client';

import { Button } from '../../ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { submissionFormStyles } from './styles';
import { SubmitActionsProps } from '../shared/types';

export default function SubmitActions({
  isSubmitting,
  onCancel,
}: SubmitActionsProps) {
  return (
    <div className={submissionFormStyles.submitRow}>
      <Button
        type='submit'
        size='lg'
        disabled={isSubmitting}
        className={submissionFormStyles.submitButton}
      >
        {isSubmitting ? (
          <>
            <Loader2 className={submissionFormStyles.submitIconSpin} />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle className={submissionFormStyles.submitIcon} />
            Submit Book for Review
          </>
        )}
      </Button>
      <Button
        type='button'
        variant='outline'
        size='lg'
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
    </div>
  );
}
