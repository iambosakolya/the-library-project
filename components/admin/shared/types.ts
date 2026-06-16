import type { ClubEventRequest } from '@/types';

export interface BookSubmissionActionsProps {
  submissionId: string;
  submissionTitle: string;
  submissionAuthor: string;
}

export interface RejectReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
  requestTitle?: string;
}

export interface RequestDetailModalProps {
  request: ClubEventRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SearchResult {
  id: string;
  name: string;
  author: string;
  images?: string[];
  slug: string;
}

export interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
}

export interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
  initialQuery: string;
}

export interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
}
