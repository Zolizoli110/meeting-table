-- CreateTable
CREATE TABLE "SubscribedClient" (
    "meetingroom_id" INTEGER NOT NULL,
    "callback_ip" TEXT NOT NULL,

    CONSTRAINT "SubscribedClient_pkey" PRIMARY KEY ("meetingroom_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscribedClient_meetingroom_id_key" ON "SubscribedClient"("meetingroom_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscribedClient_callback_ip_key" ON "SubscribedClient"("callback_ip");

-- AddForeignKey
ALTER TABLE "SubscribedClient" ADD CONSTRAINT "SubscribedClient_meetingroom_id_fkey" FOREIGN KEY ("meetingroom_id") REFERENCES "MeetingRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
