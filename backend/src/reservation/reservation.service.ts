import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import CreateReservationDto from "./dto/create-reservation.dto"
import { UpdateReservationDto } from './dto/update-reservation.dto';
import PrismaErrorHandler from './../prisma-errors';
import { CalendarService } from 'src/calendar/calendar.service';

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
    } }

  async create(body: CreateReservationDto) {
    if (!body.userEmails) {
      this.calendarService.uploadGoogleEvent(
        body.roomId,
        new Date(body.dateStart),
        new Date(body.dateEnd),
        body.resName,
        body.timeZone,
        body.description,
        body.arrangerEmail ? body.arrangerEmail : undefined,
        body.userEmails ? body.userEmails : undefined,
        body.RRULE_frequency ? body.RRULE_frequency : undefined,
        body.RRULE_until ? new Date(body.RRULE_until) : undefined,
        body.RRULE_count ? body.RRULE_count : undefined,
        body.RRULE_interval ? body.RRULE_interval : undefined,
        body.RRULE_byDay ? body.RRULE_byDay : undefined,
        body.RRULE_byMonth ? body.RRULE_byMonth : undefined,
        body.RRULE_byMonthDay ? body.RRULE_byMonthDay : undefined,
        body.EXRULE_frequency ? body.EXRULE_frequency : undefined,
        body.EXRULE_count ? body.EXRULE_count : undefined,
        body.EXRULE_until ? new Date(body.EXRULE_until) : undefined,
        body.EXRULE_interval ? body.EXRULE_interval : undefined,
        body.EXRULE_byDay ? body.EXRULE_byDay : undefined,
        body.EXRULE_byMonth ? body.EXRULE_byMonth : undefined,
        body.EXRULE_byMonthDay ? body.EXRULE_byMonthDay : undefined,
        body.RDATE_date
          ? body.RDATE_date.map((date) => { return new Date(date) })
          : undefined,
        body.EXDATE_date
          ? body.EXDATE_date.map((date) => { return new Date(date) })
          :undefined
      )
    }
  }

  async update(id: string, body: UpdateReservationDto) {
    this.calendarService.updateGoogleEvent(
      body.roomId,
      id,
      new Date(body.dateStart),
      new Date(body.dateEnd),
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
