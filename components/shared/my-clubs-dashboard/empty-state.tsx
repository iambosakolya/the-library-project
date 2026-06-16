'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircleIcon } from 'lucide-react';
import { emptyStateStyles } from './styles';

export default function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className={emptyStateStyles.wrapper}>
        <AlertCircleIcon className={emptyStateStyles.icon} />
        <p className={emptyStateStyles.text}>{message}</p>
        <Link href='/user/create-club-event'>
          <Button className={emptyStateStyles.button} variant='outline'>
            Create a Club or Event
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
