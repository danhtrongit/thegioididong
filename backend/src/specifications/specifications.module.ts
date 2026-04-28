import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service.js';
import { SpecificationsController } from './specifications.controller.js';

@Module({
  controllers: [SpecificationsController],
  providers: [SpecificationsService],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
