'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formUrlQuery } from '@/lib/utils';
import { paginationStyles } from './styles';
import { type PaginationProps } from '../shared/types';

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className={paginationStyles.wrapper}>
      <Button
        size='lg'
        variant='outline'
        className={paginationStyles.button}
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        Previous
      </Button>
      <Button
        size='lg'
        variant='outline'
        className={paginationStyles.button}
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
