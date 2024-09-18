-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_halfHourId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_openDateId_fkey";

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_halfHourId_fkey" FOREIGN KEY ("halfHourId") REFERENCES "HalfHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_openDateId_fkey" FOREIGN KEY ("openDateId") REFERENCES "OpenDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
