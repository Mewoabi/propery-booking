import { Booking } from "src/modules/booking/entities/booking.entity";
import { Property } from "../entities/property.entity";

export class CreatePropertyDto implements Omit<Property, 'id' | 'bookings'> {
    title: string;
    location: string;
    price_per_night: number;
    availability: string;
}
