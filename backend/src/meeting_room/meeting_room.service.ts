import { Injectable, Logger } from '@nestjs/common';
import PrismaErrorHandler from './../prisma-errors';
import { PrismaService } from '../prisma/prisma.service';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';
import { CalendarService } from 'src/calendar/calendar.service';

@Injectable()
export class MeetingroomService {
    logger: Logger;
    calendarService: CalendarService;
    constructor(private readonly prisma: PrismaService) {
        this.logger = new Logger(MeetingroomService.name);
        this.calendarService = new CalendarService(prisma);
    }

    async getAll() {
        return await this.prisma.meetingRoom.findMany();
    }

    async getOne(id: string) {
        try {
            const meetingRoom = await this.prisma.meetingRoom.findUniqueOrThrow({
                where: { room_id: id },
                include:
                {
                    reservations:
                    {
                        include:
                        {
                            users:
                            {
                                select:
                                    { user_email: true }
                            }
                        }
                    }
                }
            })
            console.log(meetingRoom.reservations[0].users)
            return meetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }

    async create(calendarId: string) {
        this.calendarService.subscribeToCalendar(calendarId);
    }

    async update(id: string, body: UpdateMeetingRoomDto) {
        try {
            const meetingRoom = await this.prisma.meetingRoom.update({
                where: { room_id: id },
                data: {
                    ...body
                }
            });
            return meetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }

    async delete(calendarId: string) {
        this.calendarService.unsubscribeFromCalendar(calendarId);
    }
}
