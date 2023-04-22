import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CalendarService } from './calendar/calendar.service';
import { PrismaService } from './prisma/prisma.service';
import { RequestMethod } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const calendar = new CalendarService(new PrismaService);
  app.setGlobalPrefix("api/", {
    exclude: [
      { path: "/", method: RequestMethod.ALL }
    ]
  })
 app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });

  app.use(cookieParser())

  await app.listen(3000);
  await calendar.calendarListSyncHandler();
}
bootstrap();
