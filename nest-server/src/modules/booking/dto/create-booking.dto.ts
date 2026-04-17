import { Booking } from "../entities/booking.entity";

export class CreateBookingDto implements Omit<Booking, 'id' | 'property' | 'user'>{
    user_id: number;
    property_id: number;
    start_date: Date;
    end_date: Date;
}
