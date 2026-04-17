import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { UserService } from '../user/user.service';
import { PropertyService } from '../property/property.service';

@Injectable()
export class BookingService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    private userService: UserService,
    private propertyService: PropertyService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const user = await this.userService.findOne(createBookingDto.user_id);
    const property = await this.propertyService.findOne(createBookingDto.property_id);
    const { start_date, end_date } = createBookingDto;
    const newStart = new Date(start_date);
    const newEnd = new Date(end_date);

    // 1. Basic Validation: Start must be before End
    if (newStart >= newEnd) {
      throw new BadRequestException('Start date must be before end date');
    }

    // 2. Check for Overlaps with existing bookings on this property
    for (const existing of property.bookings) {
      const existStart = new Date(existing.start_date);
      const existEnd = new Date(existing.end_date);

      // Overlap condition: (StartA <= EndB) AND (EndA >= StartB)
      if (newStart < existEnd && newEnd > existStart) {
        throw new ConflictException(
          `Property is already booked from ${existStart.toDateString()} to ${existEnd.toDateString()}`,
        );
      }
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user,
      property,
    });
    
    return await this.bookingRepository.save(booking);
  }

  async findAll() {
    return await this.bookingRepository.find({
      relations: ['user', 'property'],
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'property'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const bookingToUpdate = await this.bookingRepository.findBy({ id });
    if(!bookingToUpdate) {
       throw new NotFoundException(`Booking with ID ${id} not found`)
    }
    return await this.bookingRepository.update(
      id,
      updateBookingDto,
    );
  }

  async remove(id: number) {
    const bookingToRemove = await this.bookingRepository.findBy({ id });
    await this.bookingRepository.remove(bookingToRemove);
  }
}
