import { PrismaClient } from '@/src/generated/prisma';

async function main() {
  const prisma = new PrismaClient();

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log('All users in database:');
    console.table(users);

    const adminUsers = users.filter((u) => u.role === 'admin');
    console.log(`\nFound ${adminUsers.length} admin user(s)`);

    if (adminUsers.length === 0) {
      console.log('\nNo admin users found!');
      console.log(
        'To make a user an admin, run:\nnpx prisma studio\nThen edit the user role to "admin"',
      );
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
