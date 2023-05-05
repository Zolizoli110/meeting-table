import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';
import { MeetingroomService } from './meeting_room.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('meetingroom')
export class MeetingroomController {
  constructor(
    private readonly meetingroomService: MeetingroomService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.meetingroomService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.meetingroomService.getOne(id);
  }

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() body: CreateMeetingRoomDto) {
    return this.meetingroomService.create(body.room_id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: UpdateMeetingRoomDto) {
    return this.meetingroomService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  delete(@Param('id') id: string) {
    return this.meetingroomService.delete(id);
  }

}
