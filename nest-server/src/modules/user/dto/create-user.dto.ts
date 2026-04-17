import { Booking } from "src/modules/booking/entities/booking.entity";
import { User } from "../entities/user.entity";

export class CreateUserDto implements Omit <User, 'id' | 'bookings'>{
    name: string;
    email: string;
    phone_number: string;
}
