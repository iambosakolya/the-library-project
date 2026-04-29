'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import {
  UserIcon,
  PackageIcon,
  UsersIcon,
  LayoutDashboardIcon,
  CalendarCheckIcon,
  BookPlusIcon,
  BookMarkedIcon,
  MenuIcon,
  ChevronDownIcon,
  BarChart3Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navGroups = [
  {
    label: 'Account',
    items: [
      { title: 'Profile', href: '/user/my-profile', icon: UserIcon },
      { title: 'Orders', href: '/user/orders', icon: PackageIcon },
      {
        title: 'Reading Dashboard',
        href: '/user/reading-dashboard',
        icon: BarChart3Icon,
      },
    ],
  },
  {
    label: 'Clubs & Events',
    items: [
      {
        title: 'My Requests',
        href: '/user/club-requests',
        icon: UsersIcon,
      },
      {
        title: 'Organizer',
        href: '/user/my-clubs',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Registrations',
        href: '/user/my-registrations',
        icon: CalendarCheckIcon,
      },
    ],
  },
  {
    label: 'Books',
    items: [
      {
        title: 'Submit Book',
        href: '/user/submit-book',
        icon: BookPlusIcon,
      },
      {
        title: 'Submissions',
        href: '/user/book-submissions',
        icon: BookMarkedIcon,
      },
    ],
  },
];

const allLinks = navGroups.flatMap((g) => g.items);

const UserNavHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeLink = allLinks.find((item) => pathName.includes(item.href));
  const activeLabel = activeLink?.title || 'Navigate';

  return (
    <nav className={cn('flex items-center', className)} {...props}>
      {/* Desktop: compact dropdown */}
      <div className='hidden md:flex md:items-center md:gap-1'>
        {navGroups.map((group) => (
          <DropdownMenu key={group.label}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  'gap-1 text-sm font-medium text-muted-foreground',
                  group.items.some((item) => pathName.includes(item.href)) &&
                    'text-foreground',
                )}
              >
                {group.label}
                <ChevronDownIcon className='h-3.5 w-3.5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              <DropdownMenuLabel className='text-xs text-muted-foreground'>
                {group.label}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {group.items.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex cursor-pointer items-center gap-2',
                      pathName.includes(item.href) && 'font-semibold',
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>

      {/* Mobile: sheet trigger */}
      <div className='md:hidden'>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant='outline' size='sm' className='gap-2'>
              <MenuIcon className='h-4 w-4' />
              <span className='max-w-[120px] truncate text-sm'>
                {activeLabel}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-72 p-0'>
            <SheetTitle className='border-b px-4 py-3 text-base font-semibold'>
              Navigation
            </SheetTitle>
            <div className='flex flex-col py-2'>
              {navGroups.map((group, gi) => (
                <div key={group.label}>
                  {gi > 0 && <div className='mx-4 my-2 border-t' />}
                  <p className='px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    const isActive = pathName.includes(item.href);
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted',
                            isActive
                              ? 'bg-muted font-medium text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          <item.icon className='h-4 w-4 flex-shrink-0' />
                          {item.title}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default UserNavHeader;
