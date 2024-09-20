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
 * Returns all open dates with available reservation spots.
 */
export async function GET() {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const openDates = await prisma.openDate.findMany({
    where: {
      date: {
        gte: today,
        lt: endOfYear,
      },
      reservations: {
        some: {
          count: {
            lt: 10,
          },
        },
      },
    },
    include: {
      reservations: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  const openDatesWithTotalAMPM = openDates.map((openDate) => {
    const totalAM = openDate.reservations
      .filter((reservation) => reservation.halfHourId <= 7)
      .reduce((acc, curr) => acc + curr.count, 0);
    const totalPM = openDate.reservations
      .filter((reservation) => reservation.halfHourId > 7)
      .reduce((acc, curr) => acc + curr.count, 0);

    return {
      id: openDate.id,
      date: openDate.date,
      totalAM,
      totalPM,
    };
  });

  return json(openDatesWithTotalAMPM);
}
