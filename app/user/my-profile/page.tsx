import { Metadata } from 'next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';

export const metadata: Metadata = {
  title: 'My Profile',
};

const UserProfile = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className='mx-auto max-w-md space-y-4'>
        <h2 className='h1-bold py-6'>My profile</h2>
        <h3 className='h3-bold'> Hi, {session?.user?.name}!</h3>

        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default UserProfile;
