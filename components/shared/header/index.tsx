import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Menu from './menu';
import CategoryDrawer from './caregory-drawer';
// import Image from 'next/image';
import Search from './search';

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <div className='flex items-center'>
          <CategoryDrawer />
          <Link href='/' className='ml-4 flex items-start'>
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
        <div className='hidden md:block'>
          <Search />
        </div>
        <div className='space-x-2'>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
