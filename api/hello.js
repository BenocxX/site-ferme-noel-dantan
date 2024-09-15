import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    return new Response(`Hello from ${user.email}.`);
  } catch (error) {
    return new Response('Something went wrong', { status: 500 });
  }
}
