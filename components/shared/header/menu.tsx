import ModeToggle from './mode-toggle';
import { Button } from '@/components/ui/button';
import {
  EllipsisVertical,
  ShoppingCart,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
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
    <div className='flex items-center gap-2'>
      {/* Desktop nav — only at lg (1024px+) */}
      <nav className='hidden items-center gap-1 lg:flex'>
        <ModeToggle />
        <Button asChild variant='ghost'>
          <Link href='/community'>
            <BarChart3 className='h-4 w-4' /> Community
          </Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/reading-insights'>
            <Lightbulb className='h-4 w-4' /> Insights
          </Link>
        </Button>
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

      {/* Mobile/tablet nav — below lg */}
      <nav className='flex items-center gap-2 lg:hidden'>
        <UserButton />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <EllipsisVertical className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent className='flex flex-col'>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription></SheetDescription>
            <ModeToggle />
            <Button asChild variant='ghost'>
              <Link href='/community'>
                <BarChart3 className='h-4 w-4' /> Community
              </Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link href='/reading-insights'>
                <Lightbulb className='h-4 w-4' /> Insights
              </Link>
            </Button>
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
