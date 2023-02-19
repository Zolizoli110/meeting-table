-- CreateTable
CREATE TABLE "Guest" (
    "guest_email" TEXT NOT NULL,
    "is_arranger" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("guest_email")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "res_id" SERIAL NOT NULL,
    "res_name" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("res_id")
);

-- CreateTable
CREATE TABLE "MeetingRoom" (
    "room_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_occupied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MeetingRoom_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "_GuestToReservation" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_guest_email_key" ON "Guest"("guest_email");

-- CreateIndex
CREATE UNIQUE INDEX "_GuestToReservation_AB_unique" ON "_GuestToReservation"("A", "B");

-- CreateIndex
CREATE INDEX "_GuestToReservation_B_index" ON "_GuestToReservation"("B");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "MeetingRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuestToReservation" ADD CONSTRAINT "_GuestToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Guest"("guest_email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuestToReservation" ADD CONSTRAINT "_GuestToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("res_id") ON DELETE CASCADE ON UPDATE CASCADE;
