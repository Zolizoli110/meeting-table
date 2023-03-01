import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GuestController],
  providers: [GuestService]
})
export class GuestModule { }
