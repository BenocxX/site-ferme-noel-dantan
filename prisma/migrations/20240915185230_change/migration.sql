/*
  Warnings:

  - Changed the type of `period` on the `HalfHour` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "HalfHour" DROP COLUMN "period",
ADD COLUMN     "period" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HalfHour_period_key" ON "HalfHour"("period");
