import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Booking, Property, User } from './entities/entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'doremi',
  database: 'booking_app',
  entities: [User, Property, Booking],
  synchronize: true,
});
