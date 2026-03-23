import { PrismaClient } from '@/src/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please check your .env file.',
  );
}

declare global {
  // eslint-disable-next-line no-var
  var prismaBase: PrismaClient | undefined;
}

const createPrismaBase = () => {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
};

export const prismaBase = globalThis.prismaBase ?? createPrismaBase();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaBase = prismaBase;
}
