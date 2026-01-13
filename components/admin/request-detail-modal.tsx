'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClubEventRequest } from '@/types';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  MailIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import RejectReasonDialog from './reject-reason-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type RequestDetailModalProps = {
  request: ClubEventRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const RequestDetailModal = ({
  request,
  open,
  onOpenChange,
}: RequestDetailModalProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  if (!request) return null;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `/api/admin/requests/${request.id}/approve`,
        {
          method: 'PATCH',
        },
      );
      const result = await response.json();

      if (result.success) {
        toast({
          description: result.message,
        });
        onOpenChange(false);
        router.refresh();
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

  const handleReject = async (reason: string) => {
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/admin/requests/${request.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const result = await response.json();

      if (result.success) {
        toast({
          description: result.message,
        });
        setShowRejectDialog(false);
        onOpenChange(false);
        router.refresh();
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

  const isEvent = request.type === 'event';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
          <DialogHeader>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <DialogTitle className='mb-2 text-2xl'>
                  {request.title}
                </DialogTitle>
                <DialogDescription className='text-base'>
                  {request.purpose}
                </DialogDescription>
              </div>
              <Badge variant='secondary' className='text-sm capitalize'>
                {request.type}
              </Badge>
            </div>
          </DialogHeader>

          <div className='space-y-6'>
            {/* User Info */}
            <div className='rounded-lg bg-muted p-4'>
              <h3 className='mb-2 flex items-center gap-2 font-semibold'>
                <UserIcon className='h-4 w-4' />
                Submitted By
              </h3>
              <div className='space-y-1 text-sm'>
                <p className='font-medium'>{request.user?.name}</p>
                <p className='flex items-center gap-1 text-muted-foreground'>
                  <MailIcon className='h-3 w-3' />
                  {request.user?.email}
                </p>
                <p className='text-muted-foreground'>
                  {format(new Date(request.createdAt), 'PPP')}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div>
                <div className='mb-1 flex items-center gap-2 text-muted-foreground'>
                  <CalendarIcon className='h-4 w-4' />
                  <span className='text-xs font-medium'>Start Date</span>
                </div>
                <p className='text-sm font-semibold'>
                  {format(new Date(request.startDate), 'PP')}
                </p>
              </div>

              {request.endDate && !isEvent && (
                <div>
                  <div className='mb-1 flex items-center gap-2 text-muted-foreground'>
                    <CalendarIcon className='h-4 w-4' />
                    <span className='text-xs font-medium'>End Date</span>
                  </div>
                  <p className='text-sm font-semibold'>
                    {format(new Date(request.endDate), 'PP')}
                  </p>
                </div>
              )}

              <div>
                <div className='mb-1 flex items-center gap-2 text-muted-foreground'>
                  <UsersIcon className='h-4 w-4' />
                  <span className='text-xs font-medium'>Capacity</span>
                </div>
                <p className='text-sm font-semibold'>{request.capacity}</p>
              </div>

              <div>
                <div className='mb-1 flex items-center gap-2 text-muted-foreground'>
                  {request.format === 'online' ? (
                    <VideoIcon className='h-4 w-4' />
                  ) : (
                    <MapPinIcon className='h-4 w-4' />
                  )}
                  <span className='text-xs font-medium'>Format</span>
                </div>
                <p className='text-sm font-semibold capitalize'>
                  {request.format}
                </p>
              </div>

              {!isEvent && (
                <div>
                  <div className='mb-1 flex items-center gap-2 text-muted-foreground'>
                    <ClockIcon className='h-4 w-4' />
                    <span className='text-xs font-medium'>Sessions</span>
                  </div>
                  <p className='text-sm font-semibold'>
                    {request.sessionCount}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className='mb-2 font-semibold'>Description</h3>
              <p className='whitespace-pre-wrap text-sm text-muted-foreground'>
                {request.description}
              </p>
            </div>

            {/* Location/Link */}
            {request.format === 'online' && request.onlineLink ? (
              <div>
                <h3 className='mb-2 font-semibold'>Online Meeting Link</h3>
                <a
                  href={request.onlineLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='break-all text-sm text-primary hover:underline'
                >
                  {request.onlineLink}
                </a>
              </div>
            ) : request.format === 'offline' && request.address ? (
              <div>
                <h3 className='mb-2 font-semibold'>Address</h3>
                <p className='text-sm text-muted-foreground'>
                  {request.address}
                </p>
              </div>
            ) : null}

            {/* Books */}
            {request.bookIds.length > 0 && (
              <div>
                <h3 className='mb-2 flex items-center gap-2 font-semibold'>
                  <BookOpenIcon className='h-4 w-4' />
                  Selected Books
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {request.bookIds.length} book(s) selected for this{' '}
                  {request.type}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {request.status === 'pending' && (
              <div className='flex gap-3 border-t pt-4'>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className='flex-1'
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isApproving || isRejecting}
                  className='flex-1'
                >
                  Reject
                </Button>
              </div>
            )}

            {request.status === 'rejected' && request.rejectionReason && (
              <div className='rounded-lg border border-destructive/20 bg-destructive/10 p-4'>
                <h3 className='mb-2 font-semibold text-destructive'>
                  Rejection Reason
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {request.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RejectReasonDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleReject}
        isLoading={isRejecting}
        requestTitle={request.title}
      />
    </>
  );
};

export default RequestDetailModal;
