'use client';

import { MyClubOrEvent } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UsersIcon,
  ActivityIcon,
  EyeIcon,
  PencilIcon,
  VideoIcon,
  MapPinIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  BarChart3Icon,
} from 'lucide-react';
import EngagementMetricsCard from '../engagement-metrics-card/engagement-metrics-card';
import { itemCardStyles } from './styles';

type ItemCardProps = {
  item: MyClubOrEvent;
  selectedMetricsId: { id: string; type: 'club' | 'event' } | null;
  onToggleMetrics: (id: string, type: 'club' | 'event') => void;
};

export default function ItemCard({
  item,
  selectedMetricsId,
  onToggleMetrics,
}: ItemCardProps) {
  const isApproved = item.requestStatus === 'approved';
  const linkBase = item.type === 'club' ? '/clubs' : '/events';

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant='default' className='gap-1'>
            <CheckCircle2Icon className='h-3 w-3' />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant='secondary' className='gap-1'>
            <ClockIcon className='h-3 w-3' />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant='destructive' className='gap-1'>
            <XCircleIcon className='h-3 w-3' />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  return (
    <Card className={itemCardStyles.wrapper}>
      <CardHeader className={itemCardStyles.header}>
        <div className={itemCardStyles.headerRow}>
          <div className='flex-1 space-y-1'>
            <div className={itemCardStyles.badges}>
              <Badge
                variant={item.format === 'online' ? 'default' : 'secondary'}
                className='gap-1'
              >
                {item.format === 'online' ? (
                  <VideoIcon className='h-3 w-3' />
                ) : (
                  <MapPinIcon className='h-3 w-3' />
                )}
                {item.format}
              </Badge>
              <Badge variant='outline'>
                {item.type === 'club' ? 'Club' : 'Event'}
              </Badge>
              {statusBadge(item.requestStatus)}
              {isApproved && !item.isActive && (
                <Badge
                  variant='outline'
                  className='border-amber-500 text-amber-600'
                >
                  Unpublished
                </Badge>
              )}
            </div>
            <CardTitle className={itemCardStyles.title}>{item.title}</CardTitle>
            <CardDescription>
              <span className='flex items-center gap-1'>
                <CalendarIcon className='h-3 w-3' />
                {format(new Date(item.startDate), 'PPP')}
                {item.endDate && (
                  <> — {format(new Date(item.endDate), 'PPP')}</>
                )}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isApproved && (
          <div className={itemCardStyles.statsGrid}>
            <div className={itemCardStyles.statBox}>
              <div className={itemCardStyles.statLabel}>
                <UsersIcon className='h-3.5 w-3.5' />
                Participants
              </div>
              <p className={itemCardStyles.statValue}>
                {item.participantCount}
                <span className={itemCardStyles.statCapacity}>/{item.capacity}</span>
              </p>
            </div>
            <div className={itemCardStyles.statBox}>
              <div className={itemCardStyles.statLabel}>
                <ActivityIcon className='h-3.5 w-3.5' />
                Registrations
              </div>
              <p className={itemCardStyles.statValue}>{item.registrationCount}</p>
            </div>
          </div>
        )}

        <div className={itemCardStyles.actionsRow}>
          {isApproved && (
            <>
              <Link href={`${linkBase}/${item.id}`}>
                <Button
                  variant='outline'
                  size='sm'
                  className={itemCardStyles.actionButton}
                >
                  <EyeIcon className='h-3.5 w-3.5' />
                  View
                </Button>
              </Link>
              <Link href={`/user/my-clubs/${item.id}/edit?type=${item.type}`}>
                <Button
                  variant='outline'
                  size='sm'
                  className={itemCardStyles.actionButton}
                >
                  <PencilIcon className='h-3.5 w-3.5' />
                  Edit
                </Button>
              </Link>
              <Link
                href={`/user/my-clubs/${item.id}/participants?type=${item.type}`}
              >
                <Button
                  variant='outline'
                  size='sm'
                  className={itemCardStyles.actionButton}
                >
                  <UsersIcon className='h-3.5 w-3.5' />
                  Participants
                </Button>
              </Link>
              <Button
                variant='outline'
                size='sm'
                className={itemCardStyles.actionButton}
                onClick={() => onToggleMetrics(item.id, item.type)}
              >
                <BarChart3Icon className='h-3.5 w-3.5' />
                Metrics
              </Button>
            </>
          )}
        </div>

        {selectedMetricsId?.id === item.id && (
          <EngagementMetricsCard id={item.id} type={item.type} />
        )}
      </CardContent>
    </Card>
  );
}
