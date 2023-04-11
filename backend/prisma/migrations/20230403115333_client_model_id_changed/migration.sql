/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `callback_ip` on the `Client` table. All the data in the column will be lost.
  - Added the required column `id` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Client_callback_ip_key";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "callback_ip",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");
