import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // const halfHoursStrings = [
  //   "8:30",
  //   "9:00",
  //   "9:30",
  //   "10:00",
  //   "10:30",
  //   "11:00",
  //   "11:30",
  //   "13:00",
  //   "13:30",
  //   "14:00",
  //   "14:30",
  //   "15:00",
  //   "15:30",
  // ]
  // let halfHourId = 1;
  // for (const halfHour of halfHoursStrings) {
  //   await prisma.halfHour.upsert({
  //     where: { id: halfHourId },
  //     update: {},
  //     create: {
  //       period: halfHour
  //     },
  //   })
  //   halfHourId++;
  // }
  // const startDate = new Date(2024, 10, 22)
  // const endDate = new Date(2024, 11, 24)
  // for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
  //   await prisma.openDate.upsert({
  //     where: { date },
  //     update: {},
  //     create: {
  //       date,
  //     },
  //   })
  // }
  // const openDates = await prisma.openDate.findMany()
  // const halfHours = await prisma.halfHour.findMany()
  // for (const openDate of openDates) {
  //   for (const halfHour of halfHours) {
  //     const reservation = await prisma.reservation.findFirst({
  //       where: {
  //         openDateId: openDate.id,
  //         halfHourId: halfHour.id,
  //       },
  //     })
  //     if (reservation) {
  //       continue
  //     }
  //     await prisma.reservation.create({
  //       data: {
  //         openDateId: openDate.id,
  //         halfHourId: halfHour.id,
  //         count: 0
  //       },
  //     })
  //   }
  // }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
