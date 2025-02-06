'use server';

import { signInInsertSchema } from '../validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
// import { isRedirectError } from 'next/dist/client/components/redirect';
import { signIn, signOut } from '@/auth';

// sign in (way: email + password)
export async function signInEmailPass(prevState: unknown, formData: FormData) {
  try {
    const user = signInInsertSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully!' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or password' };
  }
}

export async function signingOut() {
  await signOut();
}
