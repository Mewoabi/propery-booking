import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text')
  phone_number: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  location: string;

  @Column('decimal')
  price_per_night: number;

  @Column('text')
  availability: string;

  @OneToMany(() => Booking, (booking) => booking.property)
  bookings: Booking[];
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Property, (property) => property.bookings)
  property: Property;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;
}
