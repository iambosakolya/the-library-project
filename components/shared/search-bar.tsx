'use client';

import { Input } from '@/components/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { formUrlQuery } from '@/lib/utils';

type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

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
    <div className={`relative ${className}`}>
      <SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
      <Input
        type='text'
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
        className='pl-10 pr-10'
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          aria-label='Clear search'
        >
          <XIcon className='h-4 w-4' />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
