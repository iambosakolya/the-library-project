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
    <div>
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
            <form action={signingOut}>
              <Button variant='ghost'>Sign out</Button>
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
