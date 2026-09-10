import { Controller, Get, Param, Res, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { JwtService } from '@nestjs/jwt';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js'; // Assume this exists

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('generate-download-link/:bucket/:key')
  @UseGuards(JwtAuthGuard)
  async generateSecureLink(
    @Param('bucket') bucket: string, 
    @Param('key') key: string, 
    @Req() req: any
  ) {
    const user = req.user;
    // Ký một JWT token có thời hạn 5 phút (TTL) cho việc download
    const downloadToken = this.jwtService.sign(
      { bucket, key, email: user.email, sub: user.sub },
      { expiresIn: '5m', secret: process.env.DOWNLOAD_LINK_SECRET || 'bks_download_secret' }
    );

    return {
      secureUrl: `${process.env.API_URL || 'http://localhost:3000'}/documents/secure-download?token=${downloadToken}`
    };
  }

  @Get('secure-download')
  async downloadSecureFile(@Req() req: Request, @Res() res: Response) {
    const token = req.query.token as string;
    if (!token) {
      throw new UnauthorizedException('Missing download token.');
    }

    try {
      // Xác thực token (chỉ sống 5 phút)
      const payload = this.jwtService.verify(token, { 
        secret: process.env.DOWNLOAD_LINK_SECRET || 'bks_download_secret' 
      });

      const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
      
      // Kéo file từ S3 -> Giải mã -> Chèn Watermark
      const watermarkedBuffer = await this.documentsService.downloadAndWatermarkDocument(
        payload.bucket, 
        payload.key, 
        payload.email, 
        clientIp
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="BKS_SECURE_${payload.key}"`);
      res.send(watermarkedBuffer);

    } catch (error) {
      throw new UnauthorizedException('Download link is invalid or expired.');
    }
  }
}
