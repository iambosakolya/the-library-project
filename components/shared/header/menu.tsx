import ModeToggle from './mode-toggle';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, ShoppingCart, Users, Calendar } from 'lucide-react';
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
        <Button asChild variant='ghost'>
          <Link href='/clubs'>
            <Users className='h-4 w-4' /> Clubs
          </Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/events'>
            <Calendar className='h-4 w-4' /> Events
          </Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/cart'>
            <ShoppingCart className='h-4 w-4' /> Cart
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
            <UserButton />
            <Button asChild variant='ghost'>
              <Link href='/clubs'>
                <Users className='h-4 w-4' /> Clubs
              </Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link href='/events'>
                <Calendar className='h-4 w-4' /> Events
              </Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link href='/cart'>
                <ShoppingCart className='h-4 w-4' /> Cart
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
