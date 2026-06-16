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
import RejectReasonDialog from '../reject-reason-dialog/reject-reason-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { RequestDetailModalProps } from '../shared/types';
import {
  dialogStyles,
  headerStyles,
  userInfoStyles,
  statsStyles,
  contentStyles,
  actionStyles,
  iconStyles,
} from './styles';

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
        { method: 'PATCH' },
      );
      const result = await response.json();

      if (result.success) {
        toast({ description: result.message });
        onOpenChange(false);
        router.refresh();
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
        toast({ description: result.message });
        setShowRejectDialog(false);
        onOpenChange(false);
        router.refresh();
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

  const isEvent = request.type === 'event';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={dialogStyles.content}>
          <DialogHeader>
            <div className={headerStyles.wrapper}>
              <div className={headerStyles.info}>
                <DialogTitle className={headerStyles.title}>
                  {request.title}
                </DialogTitle>
                <DialogDescription className={headerStyles.description}>
                  {request.purpose}
                </DialogDescription>
              </div>
              <Badge variant='secondary' className={headerStyles.badge}>
                {request.type}
              </Badge>
            </div>
          </DialogHeader>

          <div className={dialogStyles.sectionWrapper}>
            {/* User Info */}
            <div className={userInfoStyles.box}>
              <h3 className={userInfoStyles.title}>
                <UserIcon className={iconStyles.md} />
                Submitted By
              </h3>
              <div className={userInfoStyles.details}>
                <p className={userInfoStyles.name}>{request.user?.name}</p>
                <p className={userInfoStyles.email}>
                  <MailIcon className={iconStyles.sm} />
                  {request.user?.email}
                </p>
                <p className={userInfoStyles.date}>
                  {format(new Date(request.createdAt), 'PPP')}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={statsStyles.grid}>
              <div>
                <div className={statsStyles.label}>
                  <CalendarIcon className={iconStyles.md} />
                  <span className={statsStyles.labelText}>Start Date</span>
                </div>
                <p className={statsStyles.value}>
                  {format(new Date(request.startDate), 'PP')}
                </p>
              </div>

              {request.endDate && !isEvent && (
                <div>
                  <div className={statsStyles.label}>
                    <CalendarIcon className={iconStyles.md} />
                    <span className={statsStyles.labelText}>End Date</span>
                  </div>
                  <p className={statsStyles.value}>
                    {format(new Date(request.endDate), 'PP')}
                  </p>
                </div>
              )}

              <div>
                <div className={statsStyles.label}>
                  <UsersIcon className={iconStyles.md} />
                  <span className={statsStyles.labelText}>Capacity</span>
                </div>
                <p className={statsStyles.value}>{request.capacity}</p>
              </div>

              <div>
                <div className={statsStyles.label}>
                  {request.format === 'online' ? (
                    <VideoIcon className={iconStyles.md} />
                  ) : (
                    <MapPinIcon className={iconStyles.md} />
                  )}
                  <span className={statsStyles.labelText}>Format</span>
                </div>
                <p className='text-sm font-semibold capitalize'>
                  {request.format}
                </p>
              </div>

              {!isEvent && (
                <div>
                  <div className={statsStyles.label}>
                    <ClockIcon className={iconStyles.md} />
                    <span className={statsStyles.labelText}>Sessions</span>
                  </div>
                  <p className={statsStyles.value}>{request.sessionCount}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className={contentStyles.sectionTitle}>Description</h3>
              <p className={contentStyles.descriptionText}>
                {request.description}
              </p>
            </div>

            {/* Location/Link */}
            {request.format === 'online' && request.onlineLink ? (
              <div>
                <h3 className={contentStyles.sectionTitle}>
                  Online Meeting Link
                </h3>
                <a
                  href={request.onlineLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={contentStyles.linkText}
                >
                  {request.onlineLink}
                </a>
              </div>
            ) : request.format === 'offline' && request.address ? (
              <div>
                <h3 className={contentStyles.sectionTitle}>Address</h3>
                <p className={contentStyles.addressText}>{request.address}</p>
              </div>
            ) : null}

            {/* Books */}
            {request.bookIds.length > 0 && (
              <div>
                <h3 className={contentStyles.booksTitle}>
                  <BookOpenIcon className={iconStyles.md} />
                  Selected Books
                </h3>
                <p className={contentStyles.booksCount}>
                  {request.bookIds.length} book(s) selected for this{' '}
                  {request.type}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {request.status === 'pending' && (
              <div className={actionStyles.wrapper}>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className={actionStyles.button}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isApproving || isRejecting}
                  className={actionStyles.button}
                >
                  Reject
                </Button>
              </div>
            )}

            {request.status === 'rejected' && request.rejectionReason && (
              <div className={actionStyles.rejectionBox}>
                <h3 className={actionStyles.rejectionTitle}>
                  Rejection Reason
                </h3>
                <p className={actionStyles.rejectionText}>
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
