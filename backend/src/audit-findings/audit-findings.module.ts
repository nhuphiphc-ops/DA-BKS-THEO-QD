import { Module } from '@nestjs/common';
import { AuditFindingsController } from './audit-findings.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditFinding } from './entities/audit-finding.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([AuditFinding]), JwtModule],
  controllers: [AuditFindingsController],
})
export class AuditFindingsModule {}
