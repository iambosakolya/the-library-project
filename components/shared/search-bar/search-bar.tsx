'use client';

import { Input } from '@/components/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { formUrlQuery } from '@/lib/utils';
import { searchBarStyles } from './styles';
import { type SearchBarProps } from '../shared/types';

const SearchBar = ({
  placeholder = 'Search by title or description...',
  className = '',
}: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  );

  // Update search value when URL params change
  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'search',
      value: value || null,
    });

    // Reset to page 1 when searching
    const urlWithPage = formUrlQuery({
      params: new URLSearchParams(newUrl.split('?')[1]).toString(),
      key: 'page',
      value: '1',
    });

    router.push(urlWithPage);
  }, 500);

  const handleClear = () => {
    setSearchValue('');
    handleSearch('');
  };

  return (
    <div className={`${searchBarStyles.wrapper} ${className}`}>
      <SearchIcon className={searchBarStyles.icon} />
      <Input
        type='text'
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
        className={searchBarStyles.input}
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className={searchBarStyles.clearButton}
          aria-label='Clear search'
        >
          <XIcon className={searchBarStyles.clearIcon} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
