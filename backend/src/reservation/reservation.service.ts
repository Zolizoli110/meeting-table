import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateReservationDto from "./dto/create-reservation.dto"
import { UpdateReservationDto } from './dto/update-reservation.dto';
import moment from 'moment'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { response } from 'express';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import Errors from 'src/errors';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) { }

  async create(newReservation: CreateReservationDto) {
    try {
      const createdReservation = await this.prisma.reservation.create({
        data: {
          res_name: newReservation.resName,
          room: { connect: { room_id: newReservation.roomId } },
          date_start: newReservation.dateStart,
          date_end: newReservation.dateEnd,
          description: newReservation.description,
          guests: {
            connect: newReservation.guestEmails.map(email => ({ guest_email: email }))
          }
        }
      });
      return createdReservation;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === Errors.PRISMA_UNIQUE_CONTRAINT_FAILED) {
          throw new HttpException('a meeting is already set in this room for this date', HttpStatus.CONFLICT)
        } else if (error.code === Errors.PRISMA_INVALID_FIELD_TYPE) {
          throw new HttpException('some fields are of invalid type', HttpStatus.BAD_REQUEST)
        }
      }
      console.log(error)
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }

  }

  async findAll() {
    const allReservations = await this.prisma.reservation.findMany();
    return allReservations;
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { res_id: id },
    });
    return reservation;
  }

  async update(id: number, body: UpdateReservationDto) {
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
  }

  async remove(id: number) {
    const deletedReservation = await this.prisma.reservation.delete({
      where: { res_id: id },
    });
    return deletedReservation;
  }
}
