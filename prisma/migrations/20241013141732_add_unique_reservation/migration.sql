-- CreateTable
CREATE TABLE "UniqueReservation" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "UniqueReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UniqueReservation_hash_key" ON "UniqueReservation"("hash");

-- AddForeignKey
ALTER TABLE "UniqueReservation" ADD CONSTRAINT "UniqueReservation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
