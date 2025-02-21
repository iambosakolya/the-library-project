import Link from 'next/link';
import { auth } from '@/auth';
import { signingOut } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant='ghost' className='text-lg'>
        <Link href='/sign-in'>
          <UserIcon /> Log in
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase();
  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button>{firstInitial}</Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div>{session.user?.name}</div>
            <div>{session.user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link className='w-full' href={'/user/orders'}>
              Order history
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className='w-full' href={'/user/my-profile'}>
              My profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <form className='w-full' action={signingOut}>
              <Button
                className='px--2 h-4 w-full justify-start py-4'
                variant='ghost'
              >
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

{
}
