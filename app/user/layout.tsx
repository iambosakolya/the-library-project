import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import UserNavHeader from './main-nav';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='container mx-auto border-b'>
        <div className='flex flex-col items-center justify-between px-4 py-4 sm:h-24 sm:flex-row sm:py-0'>
          <Link href='/' className='mb-4 flex items-center sm:mb-0'>
            <BookOpen
              width={40}
              height={40}
              className='sm:h-[60px] sm:w-[60px]'
            />
            <div className='ml-2 sm:ml-4'>
              <span className='block text-xl font-bold sm:text-2xl'>
                {APP_NAME}
              </span>
              <span className='block text-sm sm:text-lg'>
                for visual culture & critical thinking
              </span>
            </div>
          </Link>
          <div className='flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
            <UserNavHeader className='w-full sm:w-auto' />
            <Menu />
          </div>
        </div>
      </div>
      <div className='container mx-auto flex-1 space-y-4 p-4 pt-6 sm:p-8'>
        {children}
      </div>
    </div>
  );
}
