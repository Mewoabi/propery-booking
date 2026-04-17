import { Property } from "src/modules/property/entities/property.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
