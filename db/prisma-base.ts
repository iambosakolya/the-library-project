import { PrismaClient } from '@/src/generated/prisma';

// Validate that DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please check your .env file.',
  );
}

// Base Prisma Client without extensions (for Prisma Studio)
declare global {
  // eslint-disable-next-line no-var
  var prismaBase: PrismaClient | undefined;
}

export const prismaBase = globalThis.prismaBase ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaBase = prismaBase;
}
