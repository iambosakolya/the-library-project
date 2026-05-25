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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { approveBookSubmission } from '@/lib/actions/book-submission.actions';
import { approveDialogStyles as styles } from './styles';
import { ApproveDialogProps } from '../shared/types';

export default function ApproveDialog({
  open,
  onOpenChange,
  submissionId,
}: ApproveDialogProps) {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [price, setPrice] = useState('0.00');
  const [stock, setStock] = useState('0');

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveBookSubmission(
        submissionId,
        price,
        Number(stock),
      );
      if (result.success) {
        toast({ description: result.message });
        onOpenChange(false);
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
      setIsApproving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Book Submission</DialogTitle>
          <DialogDescription>
            Set the price and stock for this book before adding it to the
            catalog.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <Label htmlFor='price'>Price (USD)</Label>
            <Input
              id='price'
              type='number'
              step='0.01'
              min='0'
              placeholder='0.00'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor='stock'>Stock Quantity</Label>
            <Input
              id='stock'
              type='number'
              min='0'
              placeholder='0'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isApproving}>
            {isApproving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Approving...
              </>
            ) : (
              'Approve & Add to Catalog'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
