import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { DatabaseModule } from 'src/database/database.module';
import { bookingProviders } from './booking.provider';
import { UserModule } from '../user/user.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [DatabaseModule, UserModule, PropertyModule],
  controllers: [BookingController],
  providers: [BookingService, ...bookingProviders],
  exports: [BookingService]
})
export class BookingModule {}
