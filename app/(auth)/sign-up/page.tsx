import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import SignUpForm from './signup-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign up',
};

const SignUpPage = async (props: {
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
    <div className='mx-auto h-full w-full max-w-lg'>
      <Card className='flex h-full flex-col'>
        <CardHeader className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-start'>
              <BookOpen width={60} height={60} />
            </Link>
            <div className='hidden lg:block'>
              <h3 className='text-xl font-bold'>{APP_NAME}</h3>
              <p>Welcome! Here you can create your account</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex flex-grow flex-col justify-between'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
