import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { MeetingroomModule } from './meeting_room/meeting_room.module';
import { ReservationModule } from './reservation/reservation.module';
import { GuestModule } from './guest/guest.module';
import { APP_PIPE } from '@nestjs/core';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { PrismaModule } from './prisma/prisma.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [MeetingroomModule, ReservationModule, GuestModule, AuthModule, CalendarModule, PrismaModule, ApiModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

