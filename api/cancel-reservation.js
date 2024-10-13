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
 * Will cancel a reservation based on the hash.
 */
export async function DELETE(request) {
  const { hash } = await request.json();

  const uniqueReservation = await prisma.uniqueReservation.findFirst({
    where: {
      hash,
    },
  });

  if (!uniqueReservation) {
    return json({ error: 'reservationNotFound' }, { status: 404 });
  }

  await decrementReservationCountById({ id: uniqueReservation.reservationId });
  await deleteUniqueReservation({ uniqueReservation });

  return json({ success: true }, { status: 200 });
}

async function decrementReservationCountById({ id }) {
  await prisma.reservation.update({
    where: {
      id,
    },
    data: {
      count: {
        decrement: 1,
      },
    },
  });
}

async function deleteUniqueReservation({ uniqueReservation }) {
  await prisma.uniqueReservation.delete({
    where: {
      id: uniqueReservation.id,
    },
  });
}
