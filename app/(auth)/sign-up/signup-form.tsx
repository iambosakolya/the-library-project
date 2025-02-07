'use client';

import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUpUser } from '@/lib/actions/user.actions';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

const SignUpForm = () => {
  const [formState, formAction, isPending] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <form action={formAction} className='space-y-6'>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='name'>Name</Label>
        <Input
          type='name'
          name='name'
          id='name'
          placeholder='Your name'
          // required
        />
      </div>
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input
          type='email'
          name='email'
          id='email'
          // required
          placeholder='Your email'
        />
      </div>
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input
          type='password'
          name='password'
          id='password'
          placeholder='Create password'
        />
      </div>
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='confirmPassword'>Confirm password</Label>
        <Input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          placeholder='Confirm password'
        />
      </div>
      <Button className='w-full text-lg' disabled={isPending}>
        {isPending ? 'loading...' : 'Create an account'}
      </Button>
      {formState && !formState.success && (
        <div className='text-center'>{formState.message}</div>
      )}
      <div className='text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link href='/sign-in' target='_self' className='link'>
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
