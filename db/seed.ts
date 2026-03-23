import { PrismaClient } from '@/src/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import sampleData from './sample-data';

async function main() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.product.deleteMany();
    // await prisma.account.deleteMany();
    // await prisma.session.deleteMany();
    // await prisma.verificationToken.deleteMany();
    // await prisma.user.deleteMany();
    // await prisma.order.deleteMany();
    // await prisma.orderItem.deleteMany();
    // await prisma.cart.deleteMany();

    await prisma.product.createMany({ data: sampleData.products });
    // await prisma.user.createMany({ data: sampleData.users });

    console.log('Sample data has been added to the database');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

// npx tsx ./db/seed