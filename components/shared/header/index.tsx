import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Menu from './menu';
// import Image from 'next/image';

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <div className='flex items-center'>
          <Link href='/' className='flex items-start'>
            {/* <Image  
              src="/images/read-book-icon.svg"
              alt={APP_NAME}
              width={50}
              height={50}
              priority={true}
            /> */}
            <BookOpen width={60} height={60} />
            <div className='ml-4'>
              <span className='block text-2xl font-bold'>{APP_NAME}</span>
              <span className='block text-lg'>
                for visual culture & critical thinking
              </span>
            </div>
          </Link>
        </div>
        <div className='space-x-2'>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
