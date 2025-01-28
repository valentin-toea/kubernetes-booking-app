import { Controller, Get, Post, Put, Param, Body, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.bookingsService.findAll(req.user.id);
  }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: any,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Get('user/:userId')
  async getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getBookingsByUserId(userId);
  }

  @Get('service/:serviceId')
  async getBookingsByService(@Param('serviceId') serviceId: string) {
    return this.bookingsService.getBookingsByService(serviceId);
  }

  @Get('service/:serviceId/user/:userId')
  async getBookingsByServiceAndUser(
    @Param('serviceId') serviceId: string,
    @Param('userId') userId: string,
  ) {
    return this.bookingsService.getBookingsByServiceAndUser(serviceId, userId);
  }
}
