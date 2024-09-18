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
