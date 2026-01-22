
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in DB:', users.length);
    users.forEach(u => console.log(`- ${u.id}: ${u.email}`));

    const sessions = await prisma.session.findMany();
    console.log('Sessions in DB:', sessions.length);
    sessions.forEach(s => console.log(`- User: ${s.userId}, Token: ${s.token.substring(0, 10)}...`));

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
