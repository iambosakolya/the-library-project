'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  approveBookSubmission,
  rejectBookSubmission,
  mergeBookSubmission,
  searchCatalog,
} from '@/lib/actions/book-submission.actions';
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
import { Input } from '@/components/ui/input';
import {
  CheckCircle,
  XCircle,
  Merge,
  Search,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface BookSubmissionActionsProps {
  submissionId: string;
  submissionTitle: string;
  submissionAuthor: string;
}

export default function BookSubmissionActions({
  submissionId,
  submissionTitle,
  submissionAuthor,
}: BookSubmissionActionsProps) {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [price, setPrice] = useState('0.00');
  const [stock, setStock] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string;
      name: string;
      author: string;
      images?: string[];
      slug: string;
    }>
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveBookSubmission(
        submissionId,
        price,
        Number(stock),
      );
      if (result.success) {
        toast({
          description: result.message,
        });
        setShowApproveDialog(false);
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
      const result = await rejectBookSubmission(submissionId, rejectionReason);
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

  const handleMerge = async () => {
    if (!selectedProductId) {
      toast({
        variant: 'destructive',
        description: 'Please select a product to merge with',
      });
      return;
    }

    setIsMerging(true);
    try {
      const result = await mergeBookSubmission(submissionId, selectedProductId);
      if (result.success) {
        toast({
          description: result.message,
        });
        setShowMergeDialog(false);
        setSelectedProductId(null);
        setSearchQuery('');
        setSearchResults([]);
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
      setIsMerging(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchCatalog(searchQuery);
      if (result.success && result.data) {
        setSearchResults(result.data);
        if (result.data.length === 0) {
          toast({
            description: 'No matching books found in catalog',
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error searching catalog',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className='flex flex-wrap gap-3'>
        <Button
          onClick={() => setShowApproveDialog(true)}
          disabled={isApproving}
          className='flex items-center gap-2'
        >
          <CheckCircle className='h-4 w-4' />
          Approve
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setSearchQuery(`${submissionTitle} ${submissionAuthor}`);
            setShowMergeDialog(true);
          }}
          disabled={isMerging}
          className='flex items-center gap-2'
        >
          <Merge className='h-4 w-4' />
          Merge with Existing
        </Button>
        <Button
          variant='destructive'
          onClick={() => setShowRejectDialog(true)}
          disabled={isRejecting}
          className='flex items-center gap-2'
        >
          <XCircle className='h-4 w-4' />
          Reject
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Book Submission</DialogTitle>
            <DialogDescription>
              Set the price and stock for this book before adding it to the
              catalog.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
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
            <div className='space-y-2'>
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
            <Button
              variant='outline'
              onClick={() => setShowApproveDialog(false)}
            >
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

      {/* Merge Dialog */}
      <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Merge with Existing Book</DialogTitle>
            <DialogDescription>
              Search for an existing book in the catalog to merge this
              submission with.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='flex gap-2'>
              <Input
                placeholder='Search by title or author...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Search className='h-4 w-4' />
                )}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className='max-h-96 space-y-2 overflow-y-auto'>
                <p className='text-sm text-muted-foreground'>
                  Select a book to merge with:
                </p>
                {searchResults.map((book) => (
                  <button
                    type='button'
                    key={book.id}
                    onClick={() => setSelectedProductId(book.id)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition hover:bg-accent ${
                      selectedProductId === book.id
                        ? 'border-primary bg-accent'
                        : ''
                    }`}
                  >
                    {book.images && book.images[0] && (
                      <Image
                        src={book.images[0]}
                        alt={book.name}
                        width={60}
                        height={90}
                        className='rounded object-cover'
                      />
                    )}
                    <div className='flex-1'>
                      <p className='font-medium'>{book.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {book.author}
                      </p>
                      {selectedProductId === book.id && (
                        <p className='mt-1 text-sm font-medium text-primary'>
                          ✓ Selected
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowMergeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMerge}
              disabled={isMerging || !selectedProductId}
            >
              {isMerging ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Merging...
                </>
              ) : (
                'Merge Submission'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Book Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission. This will
              be visible to the user.
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
    </>
  );
}
