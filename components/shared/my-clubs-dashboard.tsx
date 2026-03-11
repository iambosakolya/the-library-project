'use client';

import { useState } from 'react';
import { MyClubOrEvent } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  PlusIcon,
  EyeIcon,
  PencilIcon,
  VideoIcon,
  MapPinIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  BarChart3Icon,
} from 'lucide-react';
import EngagementMetricsCard from './engagement-metrics-card';

type Props = {
  items: MyClubOrEvent[];
};

export default function MyClubsDashboard({ items }: Props) {
  const [selectedMetricsId, setSelectedMetricsId] = useState<{
    id: string;
    type: 'club' | 'event';
  } | null>(null);

  const activeItems = items.filter(
    (i) => i.requestStatus === 'approved' && i.isActive,
  );
  const pendingItems = items.filter((i) => i.requestStatus === 'pending');
  const rejectedItems = items.filter((i) => i.requestStatus === 'rejected');
  const inactiveItems = items.filter(
    (i) => i.requestStatus === 'approved' && !i.isActive,
  );

  const totalParticipants = activeItems.reduce(
    (sum, item) => sum + item.participantCount,
    0,
  );

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

  const ItemCard = ({ item }: { item: MyClubOrEvent }) => {
    const isApproved = item.requestStatus === 'approved';
    const linkBase = item.type === 'club' ? '/clubs' : '/events';

    return (
      <Card className='transition-shadow hover:shadow-lg'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 space-y-1'>
              <div className='flex flex-wrap items-center gap-2'>
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
              <CardTitle className='text-lg'>{item.title}</CardTitle>
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
            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-lg bg-muted/50 p-3 text-center'>
                <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
                  <UsersIcon className='h-3.5 w-3.5' />
                  Participants
                </div>
                <p className='mt-1 text-2xl font-bold'>
                  {item.participantCount}
                  <span className='text-sm font-normal text-muted-foreground'>
                    /{item.capacity}
                  </span>
                </p>
              </div>
              <div className='rounded-lg bg-muted/50 p-3 text-center'>
                <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
                  <ActivityIcon className='h-3.5 w-3.5' />
                  Registrations
                </div>
                <p className='mt-1 text-2xl font-bold'>
                  {item.registrationCount}
                </p>
              </div>
            </div>
          )}

          <div className='flex flex-wrap gap-2'>
            {isApproved && (
              <>
                <Link href={`${linkBase}/${item.id}`}>
                  <Button variant='outline' size='sm' className='gap-1'>
                    <EyeIcon className='h-3.5 w-3.5' />
                    View
                  </Button>
                </Link>
                <Link
                  href={`/user/my-clubs/${item.id}/edit?type=${item.type}`}
                >
                  <Button variant='outline' size='sm' className='gap-1'>
                    <PencilIcon className='h-3.5 w-3.5' />
                    Edit
                  </Button>
                </Link>
                <Link
                  href={`/user/my-clubs/${item.id}/participants?type=${item.type}`}
                >
                  <Button variant='outline' size='sm' className='gap-1'>
                    <UsersIcon className='h-3.5 w-3.5' />
                    Participants
                  </Button>
                </Link>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-1'
                  onClick={() =>
                    setSelectedMetricsId(
                      selectedMetricsId?.id === item.id
                        ? null
                        : { id: item.id, type: item.type },
                    )
                  }
                >
                  <BarChart3Icon className='h-3.5 w-3.5' />
                  Metrics
                </Button>
              </>
            )}
          </div>

          {selectedMetricsId?.id === item.id && (
            <EngagementMetricsCard
              id={item.id}
              type={item.type}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-primary/10 p-2'>
                <ActivityIcon className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Active</p>
                <p className='text-2xl font-bold'>{activeItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30'>
                <ClockIcon className='h-5 w-5 text-amber-600' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Pending</p>
                <p className='text-2xl font-bold'>{pendingItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30'>
                <UsersIcon className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Total Participants
                </p>
                <p className='text-2xl font-bold'>{totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-green-100 p-2 dark:bg-green-900/30'>
                <BarChart3Icon className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Total Created</p>
                <p className='text-2xl font-bold'>{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='active' className='space-y-4'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <TabsList>
            <TabsTrigger value='active'>
              Active ({activeItems.length})
            </TabsTrigger>
            <TabsTrigger value='pending'>
              Pending ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value='inactive'>
              Inactive ({inactiveItems.length})
            </TabsTrigger>
            <TabsTrigger value='rejected'>
              Rejected ({rejectedItems.length})
            </TabsTrigger>
          </TabsList>
          <Link href='/user/create-club-event'>
            <Button className='gap-1'>
              <PlusIcon className='h-4 w-4' />
              Create New
            </Button>
          </Link>
        </div>

        <TabsContent value='active' className='space-y-4'>
          {activeItems.length === 0 ? (
            <EmptyState message='No active clubs or events yet.' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {activeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='pending' className='space-y-4'>
          {pendingItems.length === 0 ? (
            <EmptyState message='No pending requests.' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {pendingItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='inactive' className='space-y-4'>
          {inactiveItems.length === 0 ? (
            <EmptyState message='No inactive clubs or events.' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {inactiveItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='rejected' className='space-y-4'>
          {rejectedItems.length === 0 ? (
            <EmptyState message='No rejected requests.' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {rejectedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <AlertCircleIcon className='mb-4 h-12 w-12 text-muted-foreground' />
        <p className='text-muted-foreground'>{message}</p>
        <Link href='/user/create-club-event'>
          <Button className='mt-4' variant='outline'>
            Create a Club or Event
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
