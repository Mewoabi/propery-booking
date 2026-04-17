import type { Repository } from 'typeorm';
import { Booking } from '../entities/entities';
import { HttpError } from '../http-error';
import type { CreateBookingDto, UpdateBookingDto } from '../types/dto';
import { PropertyService } from './property.service';
import { UserService } from './user.service';

export class BookingService {
  constructor(
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UserService,
    private readonly propertyService: PropertyService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const user = await this.userService.findOne(createBookingDto.user_id);
    const property = await this.propertyService.findOne(createBookingDto.property_id);
    const { start_date, end_date } = createBookingDto;
    const newStart = new Date(start_date);
    const newEnd = new Date(end_date);

    if (newStart >= newEnd) {
      throw new HttpError(400, 'Start date must be before end date');
    }

    for (const existing of property.bookings) {
      const existStart = new Date(existing.start_date);
      const existEnd = new Date(existing.end_date);

      if (newStart < existEnd && newEnd > existStart) {
        throw new HttpError(
          409,
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
      throw new HttpError(404, `Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const bookingToUpdate = await this.bookingRepository.findBy({ id });
    if (!bookingToUpdate) {
      throw new HttpError(404, `Booking with ID ${id} not found`);
    }
    return await this.bookingRepository.update(id, updateBookingDto);
  }

  async remove(id: number) {
    const bookingToRemove = await this.bookingRepository.findBy({ id });
    await this.bookingRepository.remove(bookingToRemove);
  }
}
