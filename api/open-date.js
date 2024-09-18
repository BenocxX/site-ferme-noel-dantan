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
export async function GET(request) {
  // TODO: Check for current year only
  const openDates = await prisma.openDate.findMany({
    where: {
      reservations: {
        some: {
          count: {
            lt: 10,
          },
        },
      },
    },
  });

  return json(openDates);
}
