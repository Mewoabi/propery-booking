import type { Repository } from 'typeorm';
import { User } from '../entities/entities';
import { HttpError } from '../http-error';
import type { CreateUserDto, UpdateUserDto } from '../types/dto';

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['bookings'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });
    if (!user) {
      throw new HttpError(404, `User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpError(404, `User with ID ${id} not found`);
    }
  }
}
