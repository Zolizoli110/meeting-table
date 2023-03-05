import { Injectable } from '@nestjs/common';
import PrismaErrorHandler from './../prisma-errors';
import { PrismaService } from '../prisma/prisma.service';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';

@Injectable()
export class MeetingroomService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllMeetingRooms() {
        return await this.prisma.meetingRoom.findMany();
    }

    async getMeetingRoomInfo(id: number) {
        try {
            const meetingRoom = await this.prisma.meetingRoom.findUniqueOrThrow({
                where: { room_id: id }
            })
            return meetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }

    async updateMeetingRoom(id: number, updateData: UpdateMeetingRoomDto) {
        try {
            const meetingRoom = await this.prisma.meetingRoom.update({
                where: { room_id: id },
                data: {
                    ...updateData
                }
            });
            return meetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }

    async create(body: CreateMeetingRoomDto) {
        try {
            const createdMeetingRoom = await this.prisma.meetingRoom.create({
                data: {
                    name: body.name,
                },
            });
            return createdMeetingRoom;
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }

    async remove(id: number) {
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
