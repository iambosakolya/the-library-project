'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formUrlQuery } from '@/lib/utils';
import { FilterIcon, XIcon } from 'lucide-react';

type FilterSidebarProps = {
  showLocationFilter?: boolean;
};

const FilterSidebar = ({ showLocationFilter = false }: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [format, setFormat] = useState(searchParams.get('format') || 'all');
  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') || '',
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  // Sync state with URL params
  useEffect(() => {
    setFormat(searchParams.get('format') || 'all');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
    setLocation(searchParams.get('location') || '');
  }, [searchParams]);

  const applyFilters = () => {
    let url = searchParams.toString();

    // Apply format filter
    url = formUrlQuery({
      params: url,
      key: 'format',
      value: format === 'all' ? null : format,
    });

    // Apply date filters
    url = formUrlQuery({
      params: new URLSearchParams(url.split('?')[1]).toString(),
      key: 'startDate',
      value: startDate || null,
    });

    url = formUrlQuery({
      params: new URLSearchParams(url.split('?')[1]).toString(),
      key: 'endDate',
      value: endDate || null,
    });

    // Apply location filter (for offline events/clubs)
    if (showLocationFilter) {
      url = formUrlQuery({
        params: new URLSearchParams(url.split('?')[1]).toString(),
        key: 'location',
        value: location || null,
      });
    }

    // Reset to page 1 when applying filters
    url = formUrlQuery({
      params: new URLSearchParams(url.split('?')[1]).toString(),
      key: 'page',
      value: '1',
    });

    router.push(url);
  };

  const clearFilters = () => {
    setFormat('all');
    setStartDate('');
    setEndDate('');
    setLocation('');

    const url = window.location.pathname;
    const params = new URLSearchParams(searchParams);

    // Keep search param if it exists
    const search = params.get('search');
    const newParams = new URLSearchParams();
    if (search) {
      newParams.set('search', search);
    }

    router.push(url + (newParams.toString() ? `?${newParams.toString()}` : ''));
  };

  const hasActiveFilters =
    format !== 'all' ||
    startDate ||
    endDate ||
    (showLocationFilter && location);

  return (
    <div className='w-full space-y-6 rounded-lg border bg-card p-6 lg:w-64'>
      <div className='flex items-center justify-between'>
        <h3 className='flex items-center gap-2 text-lg font-semibold'>
          <FilterIcon className='h-5 w-5' />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='text-xs'
          >
            <XIcon className='mr-1 h-3 w-3' />
            Clear
          </Button>
        )}
      </div>

      {/* Format Filter */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Format</Label>
        <RadioGroup value={format} onValueChange={setFormat}>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='all' id='all' />
            <Label htmlFor='all' className='cursor-pointer font-normal'>
              All
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='online' id='online' />
            <Label htmlFor='online' className='cursor-pointer font-normal'>
              Online
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='offline' id='offline' />
            <Label htmlFor='offline' className='cursor-pointer font-normal'>
              In-Person
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Date Range Filter */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Date Range</Label>
        <div className='space-y-2'>
          <div>
            <Label
              htmlFor='startDate'
              className='text-xs text-muted-foreground'
            >
              From
            </Label>
            <Input
              id='startDate'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='mt-1'
            />
          </div>
          <div>
            <Label htmlFor='endDate' className='text-xs text-muted-foreground'>
              To
            </Label>
            <Input
              id='endDate'
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='mt-1'
            />
          </div>
        </div>
      </div>

      {/* Location Filter (for offline) */}
      {showLocationFilter && (
        <div className='space-y-3'>
          <Label htmlFor='location' className='text-sm font-medium'>
            Location
          </Label>
          <Input
            id='location'
            type='text'
            placeholder='City or address'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={format === 'online'}
          />
          <p className='text-xs text-muted-foreground'>
            Search for offline events in a specific location
          </p>
        </div>
      )}

      <Button onClick={applyFilters} className='w-full'>
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
