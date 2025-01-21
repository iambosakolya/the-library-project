import { ShoppingCart, UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-start">
            <Image
              src="/images/read-book-icon.svg"
              alt={APP_NAME}
              width={50}
              height={50}
              priority={true}
            />
          </Link>
          <div className="ml-6">
            <span className="hidden lg:block font-bold text-2xl">
              {APP_NAME}
            </span>
            <span className="hidden lg:block text-lg">
              for visual culture & critical thinking
            </span>
          </div>
        </div>
        <div className="space-x-2">
          <Button asChild variant="ghost" className="text-lg">
            <Link href="/cart">
              <ShoppingCart /> Cart
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-lg">
            <Link href="/signin">
              <UserIcon /> Log in
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
