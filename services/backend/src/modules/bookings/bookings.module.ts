import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { ServicesService } from '../services/services.service';
import { Service } from '../services/entities/service.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Service, Category])],
  controllers: [BookingsController],
  providers: [BookingsService, ServicesService, CategoriesService],
})
export class BookingsModule {}
