'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formUrlQuery } from '@/lib/utils';
import { FilterIcon, XIcon } from 'lucide-react';
import { sidebarStyles } from './styles';
import { type FilterSidebarProps } from '../shared/types';

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
    <div className={sidebarStyles.wrapper}>
      <div className={sidebarStyles.headerRow}>
        <h3 className={sidebarStyles.title}>
          <FilterIcon className={sidebarStyles.titleIcon} />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className={sidebarStyles.clearButton}
          >
            <XIcon className={sidebarStyles.clearIcon} />
            Clear
          </Button>
        )}
      </div>

      {/* Format Filter */}
      <div className={sidebarStyles.section}>
        <Label className={sidebarStyles.sectionLabel}>Format</Label>
        <RadioGroup value={format} onValueChange={setFormat}>
          <div className={sidebarStyles.radioRow}>
            <RadioGroupItem value='all' id='all' />
            <Label htmlFor='all' className={sidebarStyles.radioLabel}>
              All
            </Label>
          </div>
          <div className={sidebarStyles.radioRow}>
            <RadioGroupItem value='online' id='online' />
            <Label htmlFor='online' className={sidebarStyles.radioLabel}>
              Online
            </Label>
          </div>
          <div className={sidebarStyles.radioRow}>
            <RadioGroupItem value='offline' id='offline' />
            <Label htmlFor='offline' className={sidebarStyles.radioLabel}>
              In-Person
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Date Range Filter */}
      <div className={sidebarStyles.section}>
        <Label className={sidebarStyles.sectionLabel}>Date Range</Label>
        <div className={sidebarStyles.dateSection}>
          <div>
            <Label htmlFor='startDate' className={sidebarStyles.dateLabel}>
              From
            </Label>
            <Input
              id='startDate'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={sidebarStyles.dateInput}
            />
          </div>
          <div>
            <Label htmlFor='endDate' className={sidebarStyles.dateLabel}>
              To
            </Label>
            <Input
              id='endDate'
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={sidebarStyles.dateInput}
            />
          </div>
        </div>
      </div>

      {/* Location Filter (for offline) */}
      {showLocationFilter && (
        <div className={sidebarStyles.section}>
          <Label htmlFor='location' className={sidebarStyles.sectionLabel}>
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
          <p className={sidebarStyles.locationHint}>
            Search for offline events in a specific location
          </p>
        </div>
      )}

      <Button onClick={applyFilters} className={sidebarStyles.applyButton}>
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
