import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express-serve-static-core';
import { PrismaService } from '../prisma/prisma.service';
import { ApiService } from './api.service';
import { subscribeDto } from './dto/subscribeDto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService, private readonly prisma: PrismaService) { }

  @Get('subscribe/:meetingRoomId')
  subscribe(
    @Param('meetingRoomId', ParseIntPipe) roomId: number,
    @Query('clientId', ParseIntPipe) clientId: number,
    @Res() res: Response
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.apiService.handleClients(res, clientId, roomId)
    this.apiService.sendEvent(roomId, 'greet', `greetings client ${clientId}`);
  }
}
