import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { Roles } from '../auth/roles.decorator';
import CreateMeetingRoomDto from './dto/create-meetingroom.dto';
import UpdateMeetingRoomDto from './dto/update-meetingroom.dto';
import { MeetingroomService } from './meeting_room.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('meetingroom')
export class MeetingroomController {
  constructor(
    private readonly meetingroomService: MeetingroomService
  ) { }

  @Get()
  // @UseGuards(JwtAuthGuard)
  getAll() {
    return this.meetingroomService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.meetingroomService.getOne(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() body: CreateMeetingRoomDto) {
    return this.meetingroomService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMeetingRoomDto) {
    return this.meetingroomService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.meetingroomService.delete(id);
  }

}
