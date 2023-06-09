-- CreateTable
CREATE TABLE "User" (
    "user_email" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_email")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "res_id" TEXT NOT NULL,
    "res_name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "arranger_email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("res_id")
);

-- CreateTable
CREATE TABLE "MeetingRoom" (
    "room_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "syncToken" TEXT,

    CONSTRAINT "MeetingRoom_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_name")
);

-- CreateTable
CREATE TABLE "CalendarSync" (
    "id" INTEGER NOT NULL DEFAULT 0,
    "syncToken" TEXT NOT NULL,

    CONSTRAINT "CalendarSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "meetingroom_id" TEXT NOT NULL,
    "client_id" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("meetingroom_id")
);

-- CreateTable
CREATE TABLE "_users_of_reservation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingRoom_name_key" ON "MeetingRoom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_client_id_key" ON "Client"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "_users_of_reservation_AB_unique" ON "_users_of_reservation"("A", "B");

-- CreateIndex
CREATE INDEX "_users_of_reservation_B_index" ON "_users_of_reservation"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "Role"("role_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "MeetingRoom"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_arranger_email_fkey" FOREIGN KEY ("arranger_email") REFERENCES "User"("user_email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_meetingroom_id_fkey" FOREIGN KEY ("meetingroom_id") REFERENCES "MeetingRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_of_reservation" ADD CONSTRAINT "_users_of_reservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Reservation"("res_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_of_reservation" ADD CONSTRAINT "_users_of_reservation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_email") ON DELETE CASCADE ON UPDATE CASCADE;
