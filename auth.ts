import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // find user in the db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // if user exists
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // set user id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // console.log(token);

      // in case of name update
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;

        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // clone requst headers
        const newRequestHeaders = new Headers(request.headers);

        // create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // set newly generated sessionCartId in the response cookies
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
