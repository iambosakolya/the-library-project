'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInEmailPass } from '@/lib/actions/user.actions';
import { useActionState } from 'react';
import { signInDefaultValues } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
  const [formState, formAction, isPending] = useActionState(signInEmailPass, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <form action={formAction} className='space-y-8'>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input
          type='email'
          name='email'
          id='email'
          required
          autoComplete='email'
          defaultValue={signInDefaultValues.email}
        />
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          defaultValue={signInDefaultValues.password}
        />
      </div>
      <Button className='w-full text-lg' disabled={isPending}>
        {isPending ? 'loading...' : 'Login'}
      </Button>

      {formState && !formState.success && (
        <div className='text-center'>{formState.message}</div>
      )}
    </form>
  );
};

export default LoginForm;
