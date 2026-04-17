import type { Repository } from 'typeorm';
import { Property } from '../entities/entities';
import { HttpError } from '../http-error';
import type { CreatePropertyDto, UpdatePropertyDto } from '../types/dto';

export class PropertyService {
  constructor(private readonly propertyRepository: Repository<Property>) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    return await this.propertyRepository.save(property);
  }

  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find({
      relations: ['bookings'],
    });
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });
    if (!property) {
      throw new HttpError(404, `Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    await this.findOne(id);
    await this.propertyRepository.update(id, updatePropertyDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpError(404, `Property with ID ${id} not found`);
    }
  }

  async getAvailability(id: number, startDate: Date, endDate: Date): Promise<boolean> {
    const property = await this.findOne(id);

    if (startDate >= endDate) {
      throw new HttpError(400, 'Start date must be before end date');
    }

    for (const existing of property.bookings) {
      const existStart = new Date(existing.start_date);
      const existEnd = new Date(existing.end_date);

      if (startDate < existEnd && endDate > existStart) {
        return false;
      }
    }

    return true;
  }
}
