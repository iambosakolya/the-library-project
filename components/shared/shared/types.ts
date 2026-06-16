import {
  ReadingClub,
  Event,
  MyClubOrEvent,
  Registration,
  Attendance,
  Product,
  UserBadge,
  EngagementMetrics,
} from '@/types';

export type ClubEventCardProps = {
  data: ReadingClub | Event;
  type: 'club' | 'event';
};

export type ClubEventDetailsProps = {
  data: ReadingClub | Event;
  type: 'club' | 'event';
  isRegistered: boolean;
  registrationId?: string;
  isAuthenticated: boolean;
  books?: Array<{ id: string; name: string; images: string[]; author: string }>;
};

export type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

export type RegisterButtonProps = {
  clubId?: string;
  eventId?: string;
  type: 'club' | 'event';
  isRegistered: boolean;
  registrationId?: string;
  availableSeats: number;
  isAuthenticated: boolean;
  isPast?: boolean;
};

export type FollowButtonProps = {
  targetUserId: string;
  isFollowing: boolean;
};

export type DeleteDialogProps = {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
};

export type EngagementMetricsCardProps = {
  id: string;
  type: 'club' | 'event';
};

export type MyClubsDashboardProps = {
  items: MyClubOrEvent[];
};

export type ClubEventFormProps = {
  products: Product[];
};

export type {
  ReadingClub,
  Event,
  MyClubOrEvent,
  Registration,
  Attendance,
  Product,
  UserBadge,
  EngagementMetrics,
};

export type FormPreviewProps = {
  values: {
    type: string;
    title: string;
    purpose: string;
    description: string;
    startDate?: Date;
    endDate?: Date | null;
    capacity: number;
    sessionCount: number;
    format: string;
    address?: string | null;
    onlineLink?: string | null;
    bookIds: string[];
  };
  selectedBooks: Product[];
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export type Props = {
  entity: ReadingClub | Event;
  type: 'club' | 'event';
  products: Product[];
};

export type EngagementMetricsProps = {
  id: string;
  type: 'club' | 'event';
};

export type FilterSidebarProps = {
  showLocationFilter?: boolean;
};

export type ClubsDashboardProps = {
  items: MyClubOrEvent[];
};

export type ParticipantListViewProps = {
  participants: Registration[];
  attendanceRecords: Attendance[];
  entityId: string;
  entityType: 'club' | 'event';
  entityTitle: string;
  totalSessions: number;
};
