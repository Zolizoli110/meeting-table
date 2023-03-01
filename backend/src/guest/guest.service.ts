import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from './../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createGuestDto: CreateGuestDto) {
    try {
      const createdGuest = await this.prisma.guest.create({
        data: { ...createGuestDto }
      });
      return createdGuest;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2005') {
          throw new HttpException('invalid type in a field', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  async findAll() {
    const allGuests = await this.prisma.guest.findMany();
    return allGuests;
  }

  async findOne(guest_email: string) {
    const oneGuest = await this.prisma.guest.findUnique({
      where: { guest_email }
    });
    if (!oneGuest) throw new HttpException('guest doesn\'t exist', HttpStatus.NOT_FOUND)
    return oneGuest;
  }

  async update(guest_email: string, updateGuestDto: UpdateGuestDto) {
    const guestToBeUpdated = await this.prisma.guest.findUnique({
      where: { guest_email }
    });
    if (!guestToBeUpdated) throw new HttpException('guest doesn\'t exist', HttpStatus.NOT_FOUND);
    const updatedUser = await this.prisma.guest.update({
      where: { guest_email },
      data: { ...updateGuestDto }
    });
    return updatedUser;
  }

  async remove(guest_email: string) {
    const guestToBeDeleted = await this.prisma.guest.findUnique({
      where: { guest_email }
    });
    if (!guestToBeDeleted) throw new HttpException('user doesn\'t exist', HttpStatus.NOT_FOUND)
    const deletedGuest = await this.prisma.guest.delete({
      where: { guest_email }
    });
    return deletedGuest;
  }
}
