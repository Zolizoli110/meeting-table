import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

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
  @Roles('admin')
  create(@Body() body: CreateGuestDto) {
    return this.guestService.create(body);
  }

  @Patch(':email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('email') email: string, @Body() body: UpdateGuestDto) {
    return this.guestService.update(email, body);
  }

  @Delete(':email')
  @Roles('admin')
  delete(@Param('email') email: string) {
    return this.guestService.delete(email);
  }
}
