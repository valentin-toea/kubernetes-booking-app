import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  findAll(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { userId } });
  }

  create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId,
    });
    return this.bookingRepository.save(booking);
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found or unauthorized');
    }
    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      where: { userId },
    });

    const bookingsWithService = await Promise.all(
      bookings.map(async (booking) => {
        const service = await this.serviceRepository.findOne({
          where: { id: booking.serviceId },
        });
        return {
          ...booking,
          service,
        };
      }),
    );

    return bookingsWithService;
  }

  async getBookingsByService(serviceId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: {
        serviceId,
      },
    });
  }

  async getBookingsByServiceAndUser(
    serviceId: string,
    userId: string,
  ): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: {
        serviceId,
        userId,
      },
    });
  }
}
