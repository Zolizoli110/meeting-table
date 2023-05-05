import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import CreateReservationDto from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.reservationService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOne(@Param('id') id: string) {
    return this.reservationService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateReservationDto) {
    return this.reservationService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: UpdateReservationDto) {
    return this.reservationService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.reservationService.delete(id);
  }
}
