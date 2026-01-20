import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const email = process.env.DEMO_EMAIL || 'demo@lity.local';
const username = process.env.DEMO_USERNAME || 'demo';
const password = process.env.DEMO_PASSWORD || 'DemoPass123!';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      username,
      password: hashed,
    },
    update: {
      username,
      password: hashed,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  console.log('Demo user ready:');
  console.log(`- email: ${email}`);
  console.log(`- password: ${password}`);
  console.log(`- username: ${user.username}`);
  console.log(`- id: ${user.id}`);
}

await main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


