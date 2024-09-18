import { PrismaClient } from '@prisma/client';

export function json(content) {
  return new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function getParams(request) {
  return new URL(request.url).searchParams;
}

export function getParam(request, key) {
  return getParams(request).get(key);
}

const prisma = new PrismaClient();

export async function GET(request) {
  const dateId = getParam(request, 'dateId');

  // TODO: Check if dateId is valid

  const reservations = await prisma.reservation.findMany({
    where: {
      openDateId: parseInt(dateId),
    },
  });

  return json(reservations);
}

export async function POST(request) {
  const body = await request.json();
  const { openDateId, halfHourId } = body;

  // TODO: Check if openDateId and halfHourId are valid

  const newReservation = await prisma.reservation.create({
    data: {
      openDateId: openDateId,
      halfHourId: halfHourId,
    },
  });

  return json(newReservation);
}
