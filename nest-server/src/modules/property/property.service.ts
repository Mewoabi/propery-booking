import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @Inject('PROPERTY_REPOSITORY')
    private propertyRepository: Repository<Property>,
  ) {}

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
      throw new NotFoundException(`Property with ID ${id} not found`);
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
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }

  async getAvailability(id: number, startDate: Date, endDate: Date): Promise<boolean> {
    const property = await this.findOne(id);

    // 1. Basic Validation: Start must be before End
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // 2. Check for Overlaps with existing bookings on this property
    for (const existing of property.bookings) {
      const existStart = new Date(existing.start_date);
      const existEnd = new Date(existing.end_date);

      // Overlap condition: (StartA < EndB) AND (EndA > StartB)
      if (startDate < existEnd && endDate > existStart) {
        return false;
      }
    }

    return true;
  }
}
