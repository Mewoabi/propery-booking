import { Booking } from "src/modules/booking/entities/booking.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
