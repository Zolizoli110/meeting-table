/*
  Warnings:

  - You are about to drop the `Guest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_guests_of_reservation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_arranger_email_fkey";

-- DropForeignKey
ALTER TABLE "_guests_of_reservation" DROP CONSTRAINT "_guests_of_reservation_A_fkey";

-- DropForeignKey
ALTER TABLE "_guests_of_reservation" DROP CONSTRAINT "_guests_of_reservation_B_fkey";

-- DropTable
DROP TABLE "Guest";

-- DropTable
DROP TABLE "_guests_of_reservation";

-- CreateTable
CREATE TABLE "User" (
    "user_email" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_email")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_name")
);

-- CreateTable
CREATE TABLE "_users_of_reservation" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "_users_of_reservation_AB_unique" ON "_users_of_reservation"("A", "B");

-- CreateIndex
CREATE INDEX "_users_of_reservation_B_index" ON "_users_of_reservation"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "Role"("role_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_arranger_email_fkey" FOREIGN KEY ("arranger_email") REFERENCES "User"("user_email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_of_reservation" ADD CONSTRAINT "_users_of_reservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Reservation"("res_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_of_reservation" ADD CONSTRAINT "_users_of_reservation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_email") ON DELETE CASCADE ON UPDATE CASCADE;
