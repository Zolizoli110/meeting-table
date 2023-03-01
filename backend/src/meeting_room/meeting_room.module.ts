import { Module, ValidationPipe } from '@nestjs/common';
import { MeetingroomService } from './meeting_room.service';
import { MeetingroomController } from './meeting_room.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [MeetingroomController],
  providers: [MeetingroomService]
})
export class MeetingroomModule { }
