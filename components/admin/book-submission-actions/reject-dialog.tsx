'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rejectBookSubmission } from '@/lib/actions/book-submission.actions';
import { rejectDialogStyles as styles } from './styles';
import { RejectDialogProps } from '../shared/types';

export default function RejectDialog({
  open,
  onOpenChange,
  submissionId,
}: RejectDialogProps) {
  const { toast } = useToast();
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: 'destructive',
        description: 'Please provide a reason for rejection',
      });
      return;
    }

    setIsRejecting(true);
    try {
      const result = await rejectBookSubmission(submissionId, rejectionReason);
      if (result.success) {
        toast({ description: result.message });
        onOpenChange(false);
        setRejectionReason('');
      } else {
        toast({ variant: 'destructive', description: result.message });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Book Submission</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this submission. This will be
            visible to the user.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <Label htmlFor='reason'>Rejection Reason</Label>
            <Textarea
              id='reason'
              placeholder='Enter the reason for rejection...'
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleReject}
            disabled={isRejecting}
          >
            {isRejecting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Rejecting...
              </>
            ) : (
              'Reject Submission'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
