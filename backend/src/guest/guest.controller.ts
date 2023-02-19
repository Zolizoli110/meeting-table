import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) { }

  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @Get()
  findAll() {
    return this.guestService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.guestService.findOne(email);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() body: UpdateGuestDto) {
    return this.guestService.update(email, body);
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.guestService.remove(email);
  }
}
