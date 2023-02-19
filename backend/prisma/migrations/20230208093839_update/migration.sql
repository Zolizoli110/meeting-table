/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MeetingRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MeetingRoom_name_key" ON "MeetingRoom"("name");
