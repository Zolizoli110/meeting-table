import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import MeetingRoomDto from './dto/meetingRoomDto';
import UpdateMeetingRoomDto from './dto/updateMeetingRoomDto';

@Injectable()
export class MeetingroomService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllMeetingRooms() {
        return await this.prisma.meetingRoom.findMany();
    }

    async getMeetingRoomInfo(id: number) {
        return await this.prisma.meetingRoom.findFirst({
            where: { room_id: +id }
        });
    }

    async updateMeetingRoom(id: number, updateData: UpdateMeetingRoomDto) {
        const meetingRoom = await this.prisma.meetingRoom.update({
            where: { room_id: id },
            data: updateData
        });
        return meetingRoom;
    }

    async create(body: MeetingRoomDto) {
        const createdMeetingRoom = await this.prisma.meetingRoom.create({
            data: body,
        });
        return createdMeetingRoom;
    }

    async remove(id: number) {
        const deletedMeetingRoom = await this.prisma.meetingRoom.delete({
            where: { room_id: id }
        });
    }
}
