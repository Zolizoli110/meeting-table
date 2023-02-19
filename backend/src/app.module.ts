import { Module } from '@nestjs/common';
import { MeetingroomModule } from './meeting_room/meeting_room.module';
import { ReservationModule } from './reservation/reservation.module';
import { GuestModule } from './guest/guest.module';

@Module({
  imports: [MeetingroomModule, ReservationModule, GuestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
