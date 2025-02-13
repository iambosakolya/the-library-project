import { handlers } from '@/auth';
export const runtime = 'nodejs';

export const { GET, POST } = handlers;

// import NextAuth from "next-auth"

// const handler = NextAuth({
//   ...
// })

// export { handler as GET, handler as POST }
