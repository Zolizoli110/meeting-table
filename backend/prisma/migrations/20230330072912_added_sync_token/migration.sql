/*
  Warnings:

  - Added the required column `syncToken` to the `MeetingRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingRoom" ADD COLUMN     "syncToken" TEXT NOT NULL;
