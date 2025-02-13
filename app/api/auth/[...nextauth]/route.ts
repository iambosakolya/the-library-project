// import { handlers } from '@/auth';

// export const { GET, POST } = handlers;

// export const runtime = 'nodejs';

export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import { config } from '@/auth';

const handler = NextAuth(config);

export { handler as GET, handler as POST };