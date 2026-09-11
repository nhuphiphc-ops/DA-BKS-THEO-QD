import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolutionsController } from './resolutions.controller.js';
import { Resolution } from './entities/resolution.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Resolution])],
  controllers: [ResolutionsController]
})
export class ResolutionsModule {}
