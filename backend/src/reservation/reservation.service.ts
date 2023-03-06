import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import CreateReservationDto from "./dto/create-reservation.dto"
import { UpdateReservationDto } from './dto/update-reservation.dto';
import PrismaErrorHandler from './../prisma-errors';

@Injectable()
export class ReservationService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async getAll() {
    const allReservations = await this.prisma.reservation.findMany();
    return allReservations;
  }

  async getOne(id: number) {
    try {
      const reservation = await this.prisma.reservation.findUniqueOrThrow({
        where: { res_id: id },
      });
      return reservation;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }

  }

  async create(body: CreateReservationDto) {
    try {
      const createdReservation = await this.prisma.reservation.create({
        data: {
          res_name: body.resName,
          room: { connect: { room_id: body.roomId } },
          date_start: body.dateStart,
          date_end: body.dateEnd,
          description: body.description,
          arranger: { connect: { guest_email: body.arrangerEmail } },
          guests: {
            connect: body.guestEmails.map(email => ({ guest_email: email }))
          }
        }
      });
      return createdReservation;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }

  }

  async update(id: number, body: UpdateReservationDto) {
    try {
      const updatedReservation = await this.prisma.reservation.update({
        where: { res_id: id },
        data: {
          res_name: body.resName,
          date_start: body.dateStart,
          date_end: body.dateEnd,
          description: body.description,
          guests: {
            set: [],
            connect: body.guestEmails?.map(email => ({ guest_email: email }))
          }
        },
        include: {
          guests: true,
        }
      });
      return updatedReservation;

    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  async delete(id: number) {
    try {
      const deletedReservation = await this.prisma.reservation.delete({
        where: { res_id: id },
      });
      return deletedReservation;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }
}
