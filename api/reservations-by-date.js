import { z } from 'zod';

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

  const result = z.coerce.number().safeParse(dateId);
  if (result.error) {
    return json({ error: 'Invalid dateId' }, { status: 400 });
  }

  const date = await prisma.openDate.findFirst({
    where: {
      id: result.data,
    },
  });

  if (!date) {
    return json({ error: 'Date not found' }, { status: 404 });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      openDateId: result.data,
      count: {
        lt: 10,
      },
    },
    orderBy: {
      halfHourId: 'asc',
    },
    include: {
      halfHour: true,
    },
  });

  return json(reservations);
}

/**
 * Reserves a spot for a specific date and half hour.
 */
export async function POST(request) {
  const body = await request.json();
  const { reservationId: id } = body;

  const reservation = await prisma.reservation.findFirst({
    where: { id },
  });

  if (!reservation) {
    return json({ error: 'reservationNotFound' }, { status: 404 });
  }

  if (reservation.count >= 10) {
    return json({ error: 'reservationIsFull' }, { status: 400 });
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

  return new Response(null, { status: 204 });
}
