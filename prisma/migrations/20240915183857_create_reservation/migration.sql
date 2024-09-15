-- CreateTable
CREATE TABLE "HalfHour" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,

    CONSTRAINT "HalfHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenDate" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "halfHourId" INTEGER NOT NULL,
    "openDateId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HalfHour_period_key" ON "HalfHour"("period");

-- CreateIndex
CREATE UNIQUE INDEX "OpenDate_date_key" ON "OpenDate"("date");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_halfHourId_fkey" FOREIGN KEY ("halfHourId") REFERENCES "HalfHour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_openDateId_fkey" FOREIGN KEY ("openDateId") REFERENCES "OpenDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
