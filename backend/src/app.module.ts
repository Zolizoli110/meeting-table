import { Module, ValidationPipe } from '@nestjs/common';
import { MeetingroomModule } from './meeting_room/meeting_room.module';
import { ReservationModule } from './reservation/reservation.module';
import { GuestModule } from './guest/guest.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [MeetingroomModule, ReservationModule, GuestModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule { }
