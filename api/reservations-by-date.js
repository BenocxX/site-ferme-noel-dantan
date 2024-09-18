import { PrismaClient } from '@prisma/client';

export function json(content, init = {}) {
  const { headers, ...rest } = init;
  return new Response(JSON.stringify(content), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });
}

export function getParams(request) {
  return new URL(request.url).searchParams;
}

export function getParam(request, key) {
  return getParams(request).get(key);
}

const prisma = new PrismaClient();

/**
 * Returns all available reservation spots for a specific date.
 */
export async function GET(request) {
  const dateId = getParam(request, 'dateId');

  // TODO: Check if dateId is valid

  const reservations = await prisma.reservation.findMany({
    where: {
      openDateId: parseInt(dateId),
      count: {
        lt: 10,
      },
    },
  });

  return json(reservations);
}

/**
 * Reserves a spot for a specific date and half hour.
 */
export async function POST(request) {
  const body = await request.json();
  const { openDateId, halfHourId } = body;

  // TODO: Check if openDateId and halfHourId are valid

  const reservation = await prisma.reservation.findFirst({
    where: {
      openDateId: openDateId,
      halfHourId: halfHourId,
    },
  });

  if (reservation.count >= 10) {
    return json({ error: 'Reservation is full' }, { status: 400 });
  }

  await prisma.reservation.update({
    where: {
      id: reservation.id,
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });

  return json(body);
}
