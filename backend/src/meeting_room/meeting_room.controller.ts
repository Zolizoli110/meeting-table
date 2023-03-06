import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';
import { MeetingroomService } from './meeting_room.service';

@Controller('meetingroom')
export class MeetingroomController {
  constructor(
    private readonly meetingroomService: MeetingroomService
  ) { }

  @Get()
  getAll() {
    return this.meetingroomService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.meetingroomService.getOne(id);
  }

  @Post()
  create(@Body() body: CreateMeetingRoomDto) {
    return this.meetingroomService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMeetingRoomDto) {
    return this.meetingroomService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.meetingroomService.delete(id);
  }

}
