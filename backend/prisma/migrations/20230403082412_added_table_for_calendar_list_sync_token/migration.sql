-- CreateTable
CREATE TABLE "CalendarSync" (
    "syncToken" TEXT NOT NULL,

    CONSTRAINT "CalendarSync_pkey" PRIMARY KEY ("syncToken")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalendarSync_syncToken_key" ON "CalendarSync"("syncToken");
