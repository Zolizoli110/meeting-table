/*
  Warnings:

  - A unique constraint covering the columns `[date_start]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reservation_room_id_date_start_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_date_start_key" ON "Reservation"("date_start");
