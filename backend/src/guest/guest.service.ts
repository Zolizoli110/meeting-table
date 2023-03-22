import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import PrismaErrorHandler from './../prisma-errors';
import { PrismaService } from './../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  logger: Logger;
  constructor(
    private readonly prisma: PrismaService
  ) {
    this.logger = new Logger(GuestService.name);
  }

  async getAll() {
    const allGuests = await this.prisma.user.findMany();
    return allGuests;
  }

  async getOne(user_email: string) {
    try {
      const oneGuest = await this.prisma.user.findUniqueOrThrow({
        where: { user_email }
      });
      return oneGuest;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async create(body: CreateGuestDto) {
    try {
      const createdGuest = await this.prisma.user.create({
        data: {
          user_email: body.user_email,
          role: { connect: { role_name: body.role_name } }
        }
      });
      return createdGuest;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async update(user_email: string, body: UpdateGuestDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { user_email },
        data: {
          user_email: body.user_email,
          role: { connect: { role_name: body.role_name } }
        }
      });
      return updatedUser;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async delete(user_email: string) {
    try {
      const deletedGuest = await this.prisma.user.delete({
        where: { user_email }
      });
      return deletedGuest;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }
}
