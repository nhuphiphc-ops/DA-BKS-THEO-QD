import { Module } from '@nestjs/common';
import { AuditEvidencesController } from './audit-evidences.controller.js';
import { DocumentsModule } from '../documents/documents.module.js';

@Module({
  imports: [DocumentsModule],
  controllers: [AuditEvidencesController],
})
export class AuditEvidencesModule {}
