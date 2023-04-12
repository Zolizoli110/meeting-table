import { Body, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import CreateReservationDto from "./dto/create-reservation.dto"
import { UpdateReservationDto } from './dto/update-reservation.dto';
import PrismaErrorHandler from './../prisma-errors';
import { CalendarService } from 'src/calendar/calendar.service';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class ReservationService {
  logger: Logger;
  calendarService: CalendarService;

  constructor(
    private readonly prisma: PrismaService
  ) {
    this.logger = new Logger(ReservationService.name);
    this.calendarService = new CalendarService(prisma);
  }

  async getAll() {
    const allReservations = await this.prisma.reservation.findMany();
    return allReservations;
  }

  async getOne(id: string) {
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

    if (!body.userEmails) {
      this.calendarService.uploadGoogleEvent(
        body.roomId,
        body.dateStart,
        body.dateEnd,
        body.resName,
        body.timeZone,
        body.description,
        body.arrangerEmail
      )
    } else {
      this.calendarService.uploadGoogleEvent(
        body.roomId,
        body.dateStart,
        body.dateEnd,
        body.resName,
        body.timeZone,
        body.description,
        body.arrangerEmail,
        body.userEmails,
      )
    }

  }

  async update(id: string, body: UpdateReservationDto) {
    this.calendarService.updateGoogleEvent(
      body.roomId,
      id,
      body.dateStart,
      body.dateEnd,
      body.resName,
      body.timeZone,
      body.description,
      body.arrangerEmail,
      body.userEmails
    )
  }

  async delete(id: string) {
    this.calendarService.deleteGoogleEvent(id);
  }
}
