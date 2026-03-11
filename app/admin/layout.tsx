import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import UserNavHeader from './main-nav';
import { Input } from '@/components/ui/input';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='w-full border-b'>
        <div className='container mx-auto flex items-center justify-between gap-2 px-4 py-3'>
          <Link href='/' className='flex flex-shrink-0 items-center gap-2'>
            <BookOpen className='h-7 w-7 sm:h-9 sm:w-9' />
            <div className='min-w-0'>
              <span className='block text-lg font-bold leading-tight sm:text-xl'>
                {APP_NAME}
              </span>
              <span className='hidden text-xs text-muted-foreground sm:block'>
                visual culture & critical thinking
              </span>
            </div>
          </Link>
          <div className='flex items-center gap-2'>
            <UserNavHeader className='hidden sm:flex' />
            <div className='hidden lg:block'>
              <Input
                type='search'
                placeholder='Search...'
                className='w-[180px]'
              />
            </div>
            <Menu />
          </div>
        </div>
      </header>

      <div className='container mx-auto flex-1 space-y-4 p-4 pt-6 sm:p-8'>
        {children}
      </div>
    </div>
  );
}
