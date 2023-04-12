import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [PrismaModule],
  providers: [CalendarService]
})
export class CalendarModule {}
