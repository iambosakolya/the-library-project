'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

type RejectReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
  requestTitle?: string;
};

const RejectReasonDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  requestTitle,
}: RejectReasonDialogProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setError('');
    await onConfirm(reason);
    setReason('');
  };

  const handleCancel = () => {
    setReason('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-destructive' />
            Reject Request
          </DialogTitle>
          <DialogDescription>
            {requestTitle
              ? `You are about to reject "${requestTitle}".`
              : 'You are about to reject this request.'}{' '}
            Please provide a clear reason for rejection. This will be sent to
            the user.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2'>
          <Label htmlFor='reason'>Rejection Reason *</Label>
          <Textarea
            id='reason'
            placeholder='e.g., The description needs more detail about the reading format, or the capacity seems unrealistic...'
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            rows={4}
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Rejecting...' : 'Reject Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReasonDialog;
