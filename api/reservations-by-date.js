/* eslint-disable quotes */
import crypto from 'crypto';
import { formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { z } from 'zod';

import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';
import { PrismaClient } from '@prisma/client';

const schema = z.object({
  language: z.string().optional(),
  reservationId: z.coerce.number(),
  email: z.string().email(),
});

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
 * Returns all available reservation spots for a specific date
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
 * Reserves a spot for a specific date and half hour
 */
export async function POST(request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (result.error) {
    return json({ error: 'Invalid body' }, { status: 400 });
  }

  const { reservationId, email, language } = result.data;

  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId },
    include: {
      openDate: true,
      halfHour: true,
    },
  });

  if (!reservation) {
    return json({ error: 'reservationNotFound' }, { status: 404 });
  }

  if (reservation.count >= 10) {
    return json({ error: 'reservationIsFull' }, { status: 400 });
  }

  const hash = await createUniqueReservation({ reservation, email });
  await incrementReservationCount({ reservation });

  const date = reservation.openDate.date;
  const time = reservation.halfHour.period.replace(':', 'h');

  return json({ hash, email, time, date }, { status: 200 });
}

async function createUniqueReservation({ reservation, email }) {
  // It's ok if this is public, we just need a secret to hash the reservation to avoid humans from guessing the hash
  const secret = 'ferme-noel-dantan';
  const hash = crypto
    .createHmac('sha256', secret)
    .update(
      `${reservation.id}-${reservation.halfHourId}-${reservation.openDateId}-${email}-${new Date().getTime()}`
    )
    .digest('hex');

  // If we are very unlucky and the hash already exists, we can just return an error. This will never happen
  if (await prisma.uniqueReservation.findFirst({ where: { hash } })) {
    return json({ error: 'unknowError' }, { status: 500 });
  }

  await prisma.uniqueReservation.create({
    data: {
      hash,
      reservation: {
        connect: {
          id: reservation.id,
        },
      },
    },
  });

  return hash;
}

async function incrementReservationCount({ reservation }) {
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
}
