import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: "djlfjdfgksdflhgasgfadhjgf",
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, PrismaService]
})
export class AuthModule {}