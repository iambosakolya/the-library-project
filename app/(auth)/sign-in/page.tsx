import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import LoginForm from './login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
      <div className='mx-auto h-full w-full max-w-lg'>
        <Card className='flex h-full flex-col'>
          <CardHeader className='flex items-start justify-between'>
            <div className='flex items-center gap-4'>
              <div className='hidden lg:block'>
                <h3 className='text-2xl font-bold'>NEW CUSTOMER?</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex flex-grow flex-col justify-between text-lg'>
            <p>
              By creating an account with our store, you will be able to move
              through the checkout process faster, store multiple shipping
              addresses, view and track your orders in your account and more.
            </p>
            <div className='mt-auto'>
              <Button className='text-md w-full'>
                <Link href='/sign-up' target='_self' className='link'>
                  Create an account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='mx-auto h-full w-full max-w-lg'>
        <Card className='flex h-full flex-col'>
          <CardHeader className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/' className='flex items-start'>
                <BookOpen width={60} height={60} />
              </Link>
              <div className='hidden lg:block'>
                <h3 className='text-xl font-bold'>{APP_NAME}</h3>
                <p>If you have an account with us, please log in.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex flex-grow flex-col justify-between'>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
