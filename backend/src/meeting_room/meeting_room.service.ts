import { Injectable, Logger } from '@nestjs/common';
import PrismaErrorHandler from './../prisma-errors';
import { PrismaService } from '../prisma/prisma.service';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';

@Injectable()
export class MeetingroomService {
    logger: Logger;
    constructor(private readonly prisma: PrismaService) {
        this.logger = new Logger(MeetingroomService.name);
    }

    async getAll() {
        return await this.prisma.meetingRoom.findMany();
    }

    async getOne(id: string) {
        try {
            const meetingRoom = await this.prisma.meetingRoom.findUniqueOrThrow({
                where: { room_id: id },
                include: { reservations: true }
            })
            return meetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }

    async create(body: CreateMeetingRoomDto) {
        try {
            const createdMeetingRoom = await this.prisma.meetingRoom.create({
                data: {
                    ...body
                },
            });
            return createdMeetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
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

    async delete(id: string) {
        try {
            const deletedMeetingRoom = await this.prisma.meetingRoom.delete({
                where: { room_id: id }
            });
            return deletedMeetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }

    }
}
