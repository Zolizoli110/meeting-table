import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CalendarService } from './calendar/calendar.service';
import { PrismaService } from './prisma/prisma.service';
import { RequestMethod } from '@nestjs/common';
import { CalendarService } from './calendar/calendar.service';
import { PrismaService } from './prisma/prisma.service';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const calendar = new CalendarService(new PrismaService);
  app.setGlobalPrefix("api/", {
    exclude: [
      { path: "/", method: RequestMethod.ALL }
    ]
  })
  app.setGlobalPrefix("api/", {
    exclude: [
      { path: "/", method: RequestMethod.ALL }
    ]
  })
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  app.enableCors();

  await app.listen(3000);
  await calendar.calendarListSyncHandler();
}
bootstrap();
