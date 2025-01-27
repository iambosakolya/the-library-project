'use client';

import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useMountedTheme } from '@/app/hooks/useMountedTheme';
import { useSystemTheme } from '@/app/hooks/useSystemTheme';

const NotFound = () => {
  const { mounted, theme } = useMountedTheme();
  const systemTheme = useSystemTheme();

  if (!mounted) return null;

  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  const imageSrc =
    effectiveTheme === 'light'
      ? '/images/black-not-found.png'
      : '/images/white-not-found.png';

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='rounded-md p-8 text-center shadow-md'>
        <Image
          src={imageSrc}
          width={320}
          height={140}
          alt={APP_NAME}
          priority={true}
        />
        <div>
          <h1 className='mt text-2xl font-bold'>Nothing found</h1>
          <Button className='my-8' onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
