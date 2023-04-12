/*
  Warnings:

  - You are about to drop the `SubscribedClient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubscribedClient" DROP CONSTRAINT "SubscribedClient_meetingroom_id_fkey";

-- AlterTable
ALTER TABLE "MeetingRoom" ADD COLUMN     "sync_token" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "SubscribedClient";

-- CreateTable
CREATE TABLE "Client" (
    "meetingroom_id" INTEGER NOT NULL,
    "client_id" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("meetingroom_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_client_id_key" ON "Client"("client_id");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_meetingroom_id_fkey" FOREIGN KEY ("meetingroom_id") REFERENCES "MeetingRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
