/*
  Warnings:

  - The primary key for the `MeetingRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_room_id_fkey";

-- DropForeignKey
ALTER TABLE "_users_of_reservation" DROP CONSTRAINT "_users_of_reservation_A_fkey";

-- AlterTable
ALTER TABLE "MeetingRoom" DROP CONSTRAINT "MeetingRoom_pkey",
ALTER COLUMN "room_id" DROP DEFAULT,
ALTER COLUMN "room_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MeetingRoom_pkey" PRIMARY KEY ("room_id");
DROP SEQUENCE "MeetingRoom_room_id_seq";

-- AlterTable
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_pkey",
ALTER COLUMN "res_id" DROP DEFAULT,
ALTER COLUMN "res_id" SET DATA TYPE TEXT,
ALTER COLUMN "room_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("res_id");
DROP SEQUENCE "Reservation_res_id_seq";

-- AlterTable
ALTER TABLE "_users_of_reservation" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "MeetingRoom"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_of_reservation" ADD CONSTRAINT "_users_of_reservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Reservation"("res_id") ON DELETE CASCADE ON UPDATE CASCADE;
