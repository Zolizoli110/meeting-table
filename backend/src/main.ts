import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config'
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}
bootstrap();
