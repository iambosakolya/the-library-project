'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Merge } from 'lucide-react';
import type { BookSubmissionActionsProps } from '../shared/types';
import { actionBarStyles as styles } from './styles';
import ApproveDialog from './approve-dialog';
import MergeDialog from './merge-dialog';
import RejectDialog from './reject-dialog';

export default function BookSubmissionActions({
  submissionId,
  submissionTitle,
  submissionAuthor,
}: BookSubmissionActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  return (
    <>
      <div className={styles.wrapper}>
        <Button
          onClick={() => setShowApproveDialog(true)}
          className={styles.button}
        >
          <CheckCircle className='h-4 w-4' />
          Approve
        </Button>
        <Button
          variant='outline'
          onClick={() => setShowMergeDialog(true)}
          className={styles.button}
        >
          <Merge className='h-4 w-4' />
          Merge with Existing
        </Button>
        <Button
          variant='destructive'
          onClick={() => setShowRejectDialog(true)}
          className={styles.button}
        >
          <XCircle className='h-4 w-4' />
          Reject
        </Button>
      </div>

      <ApproveDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        submissionId={submissionId}
      />

      <MergeDialog
        open={showMergeDialog}
        onOpenChange={setShowMergeDialog}
        submissionId={submissionId}
        initialQuery={`${submissionTitle} ${submissionAuthor}`}
      />

      <RejectDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        submissionId={submissionId}
      />
    </>
  );
}
