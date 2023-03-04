/*
  Warnings:

  - You are about to drop the column `is_arranger` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the `_GuestToReservation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `arranger_email` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GuestToReservation" DROP CONSTRAINT "_GuestToReservation_A_fkey";

-- DropForeignKey
ALTER TABLE "_GuestToReservation" DROP CONSTRAINT "_GuestToReservation_B_fkey";

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "is_arranger";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "arranger_email" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GuestToReservation";

-- CreateTable
CREATE TABLE "_guests_of_reservation" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_guests_of_reservation_AB_unique" ON "_guests_of_reservation"("A", "B");

-- CreateIndex
CREATE INDEX "_guests_of_reservation_B_index" ON "_guests_of_reservation"("B");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_arranger_email_fkey" FOREIGN KEY ("arranger_email") REFERENCES "Guest"("guest_email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_guests_of_reservation" ADD CONSTRAINT "_guests_of_reservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Guest"("guest_email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_guests_of_reservation" ADD CONSTRAINT "_guests_of_reservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("res_id") ON DELETE CASCADE ON UPDATE CASCADE;
