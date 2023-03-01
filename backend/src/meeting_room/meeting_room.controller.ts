import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';
import { MeetingroomService } from './meeting_room.service';

@Controller('meetingroom')
export class MeetingroomController {
  constructor(private readonly meetingroomService: MeetingroomService) { }

  @Get()
  getAllMeetingRooms() {
    return this.meetingroomService.getAllMeetingRooms();
  }

  @Get(':id')
  getMeetingRoomInfo(@Param('id', ParseIntPipe) id: number) {
    return this.meetingroomService.getMeetingRoomInfo(id);
  }

  @Post()
  createMeetingRoom(@Body() meetingRoom: CreateMeetingRoomDto) {
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
