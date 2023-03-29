import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express-serve-static-core';
import { ApiService } from './api.service';
import { subscribeDto } from './dto/subscribeDto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Post('subscribe')
  subscribeClient(@Body() body: subscribeDto) {
    return this.apiService.subscribeClient(body);
  }
}
