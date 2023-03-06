import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guest')
export class GuestController {
  constructor(
    private readonly guestService: GuestService
  ) { }

  @Get()
  getAll() {
    return this.guestService.getAll();
  }

  @Get(':email')
  getOne(@Param('email') email: string) {
    return this.guestService.getOne(email);
  }

  @Post()
  create(@Body() body: CreateGuestDto) {
    return this.guestService.create(body);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() body: UpdateGuestDto) {
    return this.guestService.update(email, body);
  }

  @Delete(':email')
  delete(@Param('email') email: string) {
    return this.guestService.delete(email);
  }
}
