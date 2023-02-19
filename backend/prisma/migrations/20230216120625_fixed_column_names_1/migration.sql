/*
  Warnings:

  - You are about to drop the column `roomId` on the `Reservation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[room_id,date_start]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_roomId_fkey";

-- DropIndex
DROP INDEX "Reservation_roomId_date_start_key";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "roomId",
ADD COLUMN     "room_id" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_room_id_date_start_key" ON "Reservation"("room_id", "date_start");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "MeetingRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
