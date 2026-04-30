'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInEmailPass } from '@/lib/actions/user.actions';
import { useActionState } from 'react';
import { signInDefaultValues } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';
import { signInInsertSchema } from '@/lib/validators';
import { useRef, useState } from 'react';
import { z } from 'zod';

const LoginForm = () => {
  const [formState, formAction, isPending] = useActionState(signInEmailPass, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: FormData) => {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = signInInsertSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    formAction(formData);
  };

  return (
    <form action={handleSubmit} ref={formRef} className='space-y-8'>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='grid max-w-sm items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input
          className='w-[460px]'
          type='email'
          name='email'
          id='email'
          required
          autoComplete='email'
          defaultValue={signInDefaultValues.email}
        />
        {errors.email && (
          <p className='text-sm text-destructive'>{errors.email}</p>
        )}
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input
          type='password'
          className='w-[460px]'
          name='password'
          id='password'
          placeholder='Password'
          defaultValue={signInDefaultValues.password}
        />
        {errors.password && (
          <p className='text-sm text-destructive'>{errors.password}</p>
        )}
      </div>
      <div className='gap-8'>
        <Button className='w-full text-lg' disabled={isPending}>
          {isPending ? 'Loading...' : 'Login'}
        </Button>
      </div>

      {formState && !formState.success && (
        <div className='text-center text-destructive'>{formState.message}</div>
      )}
    </form>
  );
};

export default LoginForm;
