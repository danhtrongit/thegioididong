import { Module } from '@nestjs/common';
import { PagesService } from './pages.service.js';
import { PagesController } from './pages.controller.js';

@Module({
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
