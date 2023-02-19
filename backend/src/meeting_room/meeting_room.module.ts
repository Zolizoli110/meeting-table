import { Module } from '@nestjs/common';
import { MeetingroomService } from './meeting_room.service';
import { MeetingroomController } from './meeting_room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MeetingroomController],
  providers: [MeetingroomService] 
})
export class MeetingroomModule {}
