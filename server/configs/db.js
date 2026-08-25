import { PrismaClient } from "@prisma/client";

// Prevents exhausting the connection pool from hot-reload creating
// multiple PrismaClient instances in dev (nodemon).
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
