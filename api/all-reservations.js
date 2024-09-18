import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const reservations = await prisma.reservation.findMany();
  return new Response(JSON.stringify(reservations), {
    headers: { 'Content-Type': 'application/json' },
  });
}
