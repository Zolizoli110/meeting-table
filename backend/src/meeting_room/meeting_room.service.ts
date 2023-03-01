import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import MeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';

@Injectable()
export class MeetingroomService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllMeetingRooms() {
        return await this.prisma.meetingRoom.findMany();
    }

    async getMeetingRoomInfo(id: number) {
        const meetingRoom = await this.prisma.meetingRoom.findFirst({
            where: { room_id: id }
        });
        if (!meetingRoom) {
            throw new HttpException('specified room doesn\'t exist', HttpStatus.NOT_FOUND)
        }
        return meetingRoom;
    }

    async updateMeetingRoom(id: number, updateData: UpdateMeetingRoomDto) {
        const meetingRoomToBeUpdated = await this.prisma.meetingRoom.findFirst({
            where: {
                room_id: id
            }
        });
        if (!meetingRoomToBeUpdated) {
            throw new HttpException('specified meetingroom doesn\'t exist', HttpStatus.NOT_FOUND)
        }
        const meetingRoom = await this.prisma.meetingRoom.update({
            where: { room_id: id },
            data: {
                ...updateData
            }
        });
        return meetingRoom;
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
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2005') {
                    throw new HttpException('invalid type in a field', HttpStatus.BAD_REQUEST);
                }
            }
        }
    }

    async remove(id: number) {
        const meetingRoomToBeDeleted = await this.prisma.meetingRoom.findFirst({
            where: { room_id: id }
        });
        if (!meetingRoomToBeDeleted) {
            throw new HttpException('specified meetingroom doesn\'t exist', HttpStatus.NOT_FOUND)
        }
        const deletedMeetingRoom = await this.prisma.meetingRoom.delete({
            where: { room_id: id }
        });
        return deletedMeetingRoom;
    }
}
