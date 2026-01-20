import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure the adapter for local SQLite file
// Prisma 7 requires either adapter or accelerateUrl
const adapter = new PrismaLibSql({
  // Default to the repo-root `dev.db` (this is where the seeded schema/data lives in this project)
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
