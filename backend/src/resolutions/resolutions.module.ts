import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolutionsController } from './resolutions.controller.js';
import { Resolution } from './entities/resolution.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Resolution]), JwtModule],
  controllers: [ResolutionsController]
})
export class ResolutionsModule {}
