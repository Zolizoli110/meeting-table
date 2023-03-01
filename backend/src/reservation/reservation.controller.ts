import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import CreateReservationDto from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post()
  @HttpCode(201)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateReservationDto) {
    return this.reservationService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}
