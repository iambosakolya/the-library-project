import ModeToggle from './mode-toggle';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

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
        <Button asChild variant='ghost' className='text-lg'>
          <Link href='/signin'>
            <UserIcon /> Log in
          </Link>
        </Button>
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className='flex flex-col align-center'>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription></SheetDescription>
            <Button asChild variant='ghost' className='text-lg'>
              <Link href='/cart'>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild variant='ghost' className='text-lg'>
              <Link href='/signin'>
                <UserIcon /> Log in
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
