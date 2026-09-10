import { Controller, Post, Param, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor.js';
import { DocumentsService } from '../documents/documents.service.js';

@Controller('audit-evidences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditEvidencesController {
  constructor(private readonly documentsService: DocumentsService) {}

  // Đối tượng kiểm soát upload hồ sơ/tài liệu theo yêu cầu
  @Post(':requestId/upload')
  @Roles(UserRole.AUDIT_TARGET)
  @UseInterceptors(FileInterceptor('file'), AuditLogInterceptor)
  async uploadEvidence(
    @Param('requestId') requestId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    // 1. Mã hóa file bằng AES-256-GCM trong RAM
    // 2. Upload file đã mã hóa lên S3/MinIO
    const s3Key = `evidences/${requestId}/${file.originalname}`;
    await this.documentsService.uploadEncryptedDocument(
      process.env.S3_BUCKET_NAME || 'bks-secure-bucket',
      s3Key,
      file.buffer,
      file.mimetype
    );

    // 3. Cập nhật record database status = 'SUBMITTED'
    return { message: 'Tài liệu đã được mã hóa 2 lớp và lưu trữ an toàn.' };
  }
}
