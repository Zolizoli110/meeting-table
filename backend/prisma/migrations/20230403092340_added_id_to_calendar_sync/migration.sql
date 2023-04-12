/*
  Warnings:

  - The primary key for the `CalendarSync` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CalendarSync" DROP CONSTRAINT "CalendarSync_pkey",
ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "CalendarSync_pkey" PRIMARY KEY ("id");
