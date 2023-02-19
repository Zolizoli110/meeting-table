import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import MeetingRoomDto from './dto/meetingRoomDto';
import UpdateMeetingRoomDto from './dto/updateMeetingRoomDto';
import { MeetingroomService } from './meeting_room.service';

@Controller('meetingroom')
export class MeetingroomController {
  constructor(private readonly meetingroomService: MeetingroomService) { }

  @Get()
  getAllMeetingRooms() {
    return this.meetingroomService.getAllMeetingRooms();
  }

  @Get(':id')
  getMeetingRoomInfo(@Param('id') id: number) {
    return this.meetingroomService.getMeetingRoomInfo(id);
  }

  @Post()
  createMeetingRoom(@Body() meetingRoom: MeetingRoomDto) {
    return this.meetingroomService.create(meetingRoom);
  }

  @Patch(':id')
  updateMeetingRoomInfo(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMeetingRoomDto) {
    return this.meetingroomService.updateMeetingRoom(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.meetingroomService.remove(id);
  }

}
