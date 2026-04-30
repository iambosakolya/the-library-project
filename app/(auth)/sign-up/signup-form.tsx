'use client';

import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUpUser } from '@/lib/actions/user.actions';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { registerInsertSchema } from '@/lib/validators';
import { useRef, useState } from 'react';
import { z } from 'zod';

const SignUpForm = () => {
  const [formState, formAction, isPending] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: FormData) => {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = registerInsertSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    formAction(formData);
  };

  return (
    <form action={handleSubmit} ref={formRef} className='space-y-6'>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='name'>Name</Label>
        <Input
          type='text'
          name='name'
          id='name'
          required
          placeholder='Your name'
        />
        {errors.name && (
          <p className='text-sm text-destructive'>{errors.name}</p>
        )}
      </div>
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input
          type='email'
          name='email'
          id='email'
          required
          placeholder='Your email'
        />
        {errors.email && (
          <p className='text-sm text-destructive'>{errors.email}</p>
        )}
      </div>
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input
          type='password'
          name='password'
          id='password'
          required
          minLength={5}
          placeholder='Create password (min 5 characters)'
        />
        {errors.password && (
          <p className='text-sm text-destructive'>{errors.password}</p>
        )}
      </div>
      <div className='grid w-full max-w-lg items-center gap-1.5'>
        <Label htmlFor='confirmPassword'>Confirm password</Label>
        <Input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          required
          minLength={5}
          placeholder='Confirm password'
        />
        {errors.confirmPassword && (
          <p className='text-sm text-destructive'>{errors.confirmPassword}</p>
        )}
      </div>
      <Button className='w-full text-lg' disabled={isPending}>
        {isPending ? 'Loading...' : 'Create an account'}
      </Button>
      {formState && !formState.success && (
        <div className='text-center text-destructive'>{formState.message}</div>
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
