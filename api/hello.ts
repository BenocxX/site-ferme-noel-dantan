// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export function GET(_: Request) {
  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
