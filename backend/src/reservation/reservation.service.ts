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

  async create(newReservation: CreateReservationDto) {
    try {
      const createdReservation = await this.prisma.reservation.create({
        data: {
          res_name: newReservation.resName,
          room: { connect: { room_id: newReservation.roomId } },
          date_start: newReservation.dateStart,
          date_end: newReservation.dateEnd,
          description: newReservation.description,
          arranger: { connect: { guest_email: newReservation.arrangerEmail } },
          guests: {
            connect: newReservation.guestEmails.map(email => ({ guest_email: email }))
          }
        }
      });
      return createdReservation;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }

  }

  async findAll() {
    const allReservations = await this.prisma.reservation.findMany();
    return allReservations;
  }

  async findOne(id: number) {
    try {
      const reservation = await this.prisma.reservation.findUniqueOrThrow({
        where: { res_id: id },
      });
      return reservation;
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

  async remove(id: number) {
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
