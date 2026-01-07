import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Menu from './menu';
import CategoryDrawer from './caregory-drawer';
// import Image from 'next/image';
import Search from './search';
import { headerStyles } from './header.styles';

const Header = () => {
  return (
    <header className={headerStyles.root}>
      <div className={headerStyles.wrapper}>
        <div className={headerStyles.left}>
          <CategoryDrawer />
          <Link href='/' className={headerStyles.logoLink}>
            {/* <Image  
              src="/images/read-book-icon.svg"
              alt={APP_NAME}
              width={50}
              height={50}
              priority={true}
            /> */}
            <BookOpen className={headerStyles.icon} />
            <div className={headerStyles.logoTextWrapper}>
              <span className={headerStyles.appName}>{APP_NAME}</span>
              <span className={headerStyles.tagline}>
                for visual culture & critical thinking
              </span>
            </div>
          </Link>
        </div>
        <div className={headerStyles.searchWrapper}>
          <Search />
        </div>
        <div className={headerStyles.actions}>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
