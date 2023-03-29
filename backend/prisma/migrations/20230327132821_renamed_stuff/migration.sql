/*
  Warnings:

  - You are about to drop the `SubscribedClient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubscribedClient" DROP CONSTRAINT "SubscribedClient_meetingroom_id_fkey";

-- DropTable
DROP TABLE "SubscribedClient";

-- CreateTable
CREATE TABLE "Client" (
    "meetingroom_id" INTEGER NOT NULL,
    "callback_ip" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("meetingroom_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_meetingroom_id_key" ON "Client"("meetingroom_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_callback_ip_key" ON "Client"("callback_ip");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_meetingroom_id_fkey" FOREIGN KEY ("meetingroom_id") REFERENCES "MeetingRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
