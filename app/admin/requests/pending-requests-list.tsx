'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { ClubEventRequest } from '@/types';
import RequestDetailModal from '@/components/admin/request-detail-modal';
import PendingRequestCard from './pending-request-card';

type PendingRequestsListProps = {
  initialRequests: ClubEventRequest[];
};

const PendingRequestsList = ({ initialRequests }: PendingRequestsListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  );
  const [selectedRequest, setSelectedRequest] =
    useState<ClubEventRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  }, 500);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value !== 'all') {
      params.set('type', value);
    } else {
      params.delete('type');
    }
    router.push(`?${params.toString()}`);
  };

  const handleViewDetails = (request: ClubEventRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const filterRequestsByType = (type: string) => {
    if (type === 'all') return initialRequests;
    return initialRequests.filter((req) => req.type === type);
  };

  const currentTab = searchParams.get('type') || 'all';
  const clubRequests = filterRequestsByType('club');
  const eventRequests = filterRequestsByType('event');

  return (
    <>
      <div className='space-y-6'>
        {/* Search Bar */}
        <div className='relative'>
          <SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search by title, description, or purpose...'
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            className='pl-10'
          />
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className='grid w-full max-w-md grid-cols-3'>
            <TabsTrigger value='all'>
              All ({initialRequests.length})
            </TabsTrigger>
            <TabsTrigger value='club'>
              Clubs ({clubRequests.length})
            </TabsTrigger>
            <TabsTrigger value='event'>
              Events ({eventRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='mt-6 space-y-4'>
            {initialRequests.length === 0 ? (
              <p className='py-8 text-center text-muted-foreground'>
                No pending requests found.
              </p>
            ) : (
              initialRequests.map((request) => (
                <PendingRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => handleViewDetails(request)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value='club' className='mt-6 space-y-4'>
            {clubRequests.length === 0 ? (
              <p className='py-8 text-center text-muted-foreground'>
                No pending club requests found.
              </p>
            ) : (
              clubRequests.map((request) => (
                <PendingRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => handleViewDetails(request)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value='event' className='mt-6 space-y-4'>
            {eventRequests.length === 0 ? (
              <p className='py-8 text-center text-muted-foreground'>
                No pending event requests found.
              </p>
            ) : (
              eventRequests.map((request) => (
                <PendingRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => handleViewDetails(request)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <RequestDetailModal
        request={selectedRequest}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </>
  );
};

export default PendingRequestsList;
