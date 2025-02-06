import ModeToggle from './mode-toggle';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import UserButton from './user-button';

const Menu = () => {
  return (
    <div className='flex justify-end gap-3'>
      <nav className='hidden w-full max-w-xs gap-1 md:flex'>
        <ModeToggle />
        <Button asChild variant='ghost' className='text-lg'>
          <Link href='/cart'>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className='align-center flex flex-col'>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription></SheetDescription>
            <Button asChild variant='ghost' className='text-lg'>
              <Link href='/cart'>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            {/* <Button asChild variant='ghost' className='text-lg'>
              <Link href='/sign-in'>
                <UserIcon /> Log in
              </Link>
            </Button> */}
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
