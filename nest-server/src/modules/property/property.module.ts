import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DatabaseModule } from 'src/database/database.module';
import { propertyProviders } from './property.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PropertyController],
  providers: [PropertyService, ...propertyProviders],
  exports: [PropertyService]
})
export class PropertyModule {}
