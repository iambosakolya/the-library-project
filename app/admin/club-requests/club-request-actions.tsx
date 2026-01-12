'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  approveClubRequest,
  rejectClubRequest,
} from '@/lib/actions/club-request.actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ClubRequestActions({
  requestId,
}: {
  requestId: string;
}) {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveClubRequest(requestId);
      if (result.success) {
        toast({
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsApproving(false);
    }
  };

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
      const result = await rejectClubRequest(requestId, rejectionReason);
      if (result.success) {
        toast({
          description: result.message,
        });
        setShowRejectDialog(false);
        setRejectionReason('');
      } else {
        toast({
          variant: 'destructive',
          description: result.message,
        });
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
    <>
      <div className='flex gap-4'>
        <Button onClick={handleApprove} disabled={isApproving}>
          {isApproving ? 'Approving...' : 'Approve'}
        </Button>
        <Button
          variant='destructive'
          onClick={() => setShowRejectDialog(true)}
          disabled={isRejecting}
        >
          Reject
        </Button>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be
              visible to the user.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='reason'>Rejection Reason</Label>
              <Textarea
                id='reason'
                placeholder='Enter the reason for rejection...'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className='min-h-24'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
