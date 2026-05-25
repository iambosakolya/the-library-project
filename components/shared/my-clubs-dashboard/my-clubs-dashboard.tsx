'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  UsersIcon,
  ActivityIcon,
  PlusIcon,
  ClockIcon,
  BarChart3Icon,
} from 'lucide-react';
import ItemCard from './item-card';
import EmptyState from './empty-state';
import { dashboardStyles, summaryIconStyles } from './styles';
import { type ClubsDashboardProps } from '../shared/types';

export default function MyClubsDashboard({ items }:  ClubsDashboardProps) {
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

  const handleToggleMetrics = (id: string, type: 'club' | 'event') => {
    setSelectedMetricsId(selectedMetricsId?.id === id ? null : { id, type });
  };

  return (
    <div className={dashboardStyles.wrapper}>
      {/* Summary Cards */}
      <div className={dashboardStyles.summaryGrid}>
        <Card>
          <CardContent className={dashboardStyles.summaryCard}>
            <div className={dashboardStyles.summaryRow}>
              <div className={summaryIconStyles.active}>
                <ActivityIcon className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className={dashboardStyles.summaryLabel}>Active</p>
                <p className={dashboardStyles.summaryValue}>{activeItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={dashboardStyles.summaryCard}>
            <div className={dashboardStyles.summaryRow}>
              <div className={summaryIconStyles.pending}>
                <ClockIcon className='h-5 w-5 text-amber-600' />
              </div>
              <div>
                <p className={dashboardStyles.summaryLabel}>Pending</p>
                <p className={dashboardStyles.summaryValue}>{pendingItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={dashboardStyles.summaryCard}>
            <div className={dashboardStyles.summaryRow}>
              <div className={summaryIconStyles.participants}>
                <UsersIcon className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className={dashboardStyles.summaryLabel}>Total Participants</p>
                <p className={dashboardStyles.summaryValue}>{totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={dashboardStyles.summaryCard}>
            <div className={dashboardStyles.summaryRow}>
              <div className={summaryIconStyles.total}>
                <BarChart3Icon className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className={dashboardStyles.summaryLabel}>Total Created</p>
                <p className={dashboardStyles.summaryValue}>{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='active' className={dashboardStyles.tabsWrapper}>
        <div className={dashboardStyles.tabsHeader}>
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
            <Button className={dashboardStyles.createButton}>
              <PlusIcon className='h-4 w-4' />
              Create New
            </Button>
          </Link>
        </div>

        <TabsContent value='active' className={dashboardStyles.tabContent}>
          {activeItems.length === 0 ? (
            <EmptyState message='No active clubs or events yet.' />
          ) : (
            <div className={dashboardStyles.itemsGrid}>
              {activeItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selectedMetricsId={selectedMetricsId}
                  onToggleMetrics={handleToggleMetrics}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='pending' className={dashboardStyles.tabContent}>
          {pendingItems.length === 0 ? (
            <EmptyState message='No pending requests.' />
          ) : (
            <div className={dashboardStyles.itemsGrid}>
              {pendingItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selectedMetricsId={selectedMetricsId}
                  onToggleMetrics={handleToggleMetrics}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='inactive' className={dashboardStyles.tabContent}>
          {inactiveItems.length === 0 ? (
            <EmptyState message='No inactive clubs or events.' />
          ) : (
            <div className={dashboardStyles.itemsGrid}>
              {inactiveItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selectedMetricsId={selectedMetricsId}
                  onToggleMetrics={handleToggleMetrics}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='rejected' className={dashboardStyles.tabContent}>
          {rejectedItems.length === 0 ? (
            <EmptyState message='No rejected requests.' />
          ) : (
            <div className={dashboardStyles.itemsGrid}>
              {rejectedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selectedMetricsId={selectedMetricsId}
                  onToggleMetrics={handleToggleMetrics}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
