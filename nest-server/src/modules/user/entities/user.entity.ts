import { Booking } from "src/modules/booking/entities/booking.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() =>Booking, (booking) => booking.user)
    bookings: Booking[]
}
