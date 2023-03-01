-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_room_id_fkey";

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "MeetingRoom"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;
