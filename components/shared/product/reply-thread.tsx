'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReviewReply } from '@/types';
import {
  createReply,
  updateReply,
  deleteReply,
} from '@/lib/actions/review.actions';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MessageSquare, Pencil, Trash2, User } from 'lucide-react';
import ReportDialog from './report-dialog';
import UserBadges from '@/components/shared/user-badges';

const MAX_DEPTH = 3;

const ReplyThread = ({
  replies,
  reviewId,
  userId,
  depth = 1,
}: {
  replies: ReviewReply[];
  reviewId: string;
  userId?: string;
  depth?: number;
}) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className='space-y-3'>
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          reviewId={reviewId}
          userId={userId}
          depth={depth}
        />
      ))}
    </div>
  );
};

const ReplyCard = ({
  reply,
  reviewId,
  userId,
  depth,
}: {
  reply: ReviewReply;
  reviewId: string;
  userId?: string;
  depth: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = userId === reply.userId;
  const canReply = !!userId && depth < MAX_DEPTH;

  return (
    <div className='border-l-2 border-muted pl-4'>
      {isEditing ? (
        <EditReplyForm
          reply={reply}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <Link
                href={reply.user ? `/profile/${reply.user.id}` : '#'}
                className='flex h-7 w-7 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent'
              >
                <User className='h-3 w-3 text-muted-foreground' />
              </Link>
              <Link
                href={reply.user ? `/profile/${reply.user.id}` : '#'}
                className='text-sm font-medium hover:underline'
              >
                {reply.user?.name ?? 'Anonymous'}
              </Link>
              {reply.user?.badges && reply.user.badges.length > 0 && (
                <UserBadges badges={reply.user.badges} />
              )}
              <span className='text-xs text-muted-foreground'>
                {formatDateTime(reply.createdAt).dateOnly}
              </span>
            </div>

            <div className='flex items-center gap-0.5'>
              {isOwner && (
                <>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7'
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className='h-3 w-3' />
                  </Button>
                  <DeleteReplyButton replyId={reply.id} />
                </>
              )}
              {userId && !isOwner && (
                <ReportDialog replyId={reply.id} />
              )}
            </div>
          </div>

          <p className='mt-1 text-sm leading-relaxed'>{reply.comment}</p>

          {canReply && (
            <Button
              size='sm'
              variant='ghost'
              className='mt-1 h-7 px-2 text-xs text-muted-foreground'
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare className='mr-1 h-3 w-3' />
              Reply
            </Button>
          )}
        </>
      )}

      {showReplyForm && (
        <div className='mt-2'>
          <ReplyForm
            reviewId={reviewId}
            parentId={reply.id}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {reply.children && reply.children.length > 0 && (
        <div className='mt-3'>
          <ReplyThread
            replies={reply.children}
            reviewId={reviewId}
            userId={userId}
            depth={depth + 1}
          />
        </div>
      )}
    </div>
  );
};

export const ReplyForm = ({
  reviewId,
  parentId,
  onCancel,
}: {
  reviewId: string;
  parentId?: string | null;
  onCancel: () => void;
}) => {
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length === 0) {
      toast({
        variant: 'destructive',
        description: 'Reply cannot be empty',
      });
      return;
    }

    startTransition(async () => {
      const res = await createReply({
        reviewId,
        parentId: parentId || null,
        comment,
      });

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({ description: res.message });
        setComment('');
        onCancel();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Write a reply...'
        rows={2}
        maxLength={1000}
        className='resize-none text-sm'
      />
      <div className='flex gap-2'>
        <Button size='sm' type='submit' disabled={isPending}>
          {isPending ? 'Posting...' : 'Post Reply'}
        </Button>
        <Button
          size='sm'
          type='button'
          variant='outline'
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const EditReplyForm = ({
  reply,
  onCancel,
}: {
  reply: ReviewReply;
  onCancel: () => void;
}) => {
  const [comment, setComment] = useState(reply.comment);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length === 0) {
      toast({
        variant: 'destructive',
        description: 'Reply cannot be empty',
      });
      return;
    }

    startTransition(async () => {
      const res = await updateReply(reply.id, { comment });

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({ description: res.message });
        onCancel();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        maxLength={1000}
        className='resize-none text-sm'
      />
      <div className='flex gap-2'>
        <Button size='sm' type='submit' disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </Button>
        <Button
          size='sm'
          type='button'
          variant='outline'
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const DeleteReplyButton = ({ replyId }: { replyId: string }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteReply(replyId);
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        setOpen(false);
        toast({ description: res.message });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='h-7 w-7 text-destructive hover:text-destructive'
        >
          <Trash2 className='h-3 w-3' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Reply</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this reply? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant='destructive'
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReplyThread;
