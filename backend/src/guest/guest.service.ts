import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createGuestDto: CreateGuestDto) {
    const createdGuest = await this.prisma.guest.create({
      data: { ...createGuestDto }
    });
    return createdGuest;
  }

  async findAll() {
    const allGuests = await this.prisma.guest.findMany();
    return allGuests;
  }

  async findOne(guest_email: string) {
    const oneGuest = await this.prisma.guest.findUnique({
      where: { guest_email }
    });
    return oneGuest;
  }

  async update(guest_email: string, updateGuestDto: UpdateGuestDto) {
    const updatedUser = await this.prisma.guest.update({
      where: { guest_email },
      data: { ...updateGuestDto }
    });
    return updatedUser;
  }

  async remove(email: string) {
    const deletedGuest = await this.prisma.guest.delete({
      where: { guest_email: email }
    });
    return deletedGuest;
  }
}
