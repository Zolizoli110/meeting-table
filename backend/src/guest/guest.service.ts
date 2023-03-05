import { Injectable } from '@nestjs/common';
import PrismaErrorHandler from './../prisma-errors';
import { PrismaService } from './../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createGuestDto: CreateGuestDto) {
    try {
      const createdGuest = await this.prisma.guest.create({
        data: { ...createGuestDto }
      });
      return createdGuest;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async findAll() {
    const allGuests = await this.prisma.guest.findMany();
    return allGuests;
  }

  async findOne(guest_email: string) {
    try {
      const oneGuest = await this.prisma.guest.findUniqueOrThrow({
        where: { guest_email }
      });
      return oneGuest;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async update(guest_email: string, updateGuestDto: UpdateGuestDto) {
    try {
      const updatedUser = await this.prisma.guest.update({
        where: { guest_email },
        data: { ...updateGuestDto }
      });
      return updatedUser;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async remove(guest_email: string) {
    try {
      const deletedGuest = await this.prisma.guest.delete({
        where: { guest_email }
      });
      return deletedGuest;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }
}
