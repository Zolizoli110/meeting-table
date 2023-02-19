/*
  Warnings:

  - A unique constraint covering the columns `[roomId,date_start]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_roomId_date_start_key" ON "Reservation"("roomId", "date_start");
