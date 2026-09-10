import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import * as crypto from 'crypto';

@Injectable()
export class DocumentsService {
  private s3Client: S3Client;
  private encryptionKey: Buffer;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
      },
      endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:9000',
      forcePathStyle: true, // required for MinIO
    });
    
    // Khóa AES-256 32 bytes
    this.encryptionKey = crypto.scryptSync(process.env.FILE_ENCRYPTION_SECRET || 'super_secret_file_key', 'salt', 32);
  }

  // Mã hóa mức ứng dụng (AES-256-GCM) trước khi đẩy lên Storage
  encryptBuffer(buffer: Buffer): { encrypted: Buffer; iv: Buffer; authTag: Buffer } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    return { encrypted, iv, authTag };
  }

  decryptBuffer(encrypted: Buffer, iv: Buffer, authTag: Buffer): Buffer {
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  async uploadEncryptedDocument(bucketName: string, key: string, fileBuffer: Buffer, mimeType: string) {
    const { encrypted, iv, authTag } = this.encryptBuffer(fileBuffer);
    
    // Lưu IV và AuthTag vào Metadata của S3 object để phục vụ giải mã
    await this.s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: encrypted,
      ContentType: mimeType,
      Metadata: {
        'iv': iv.toString('hex'),
        'auth-tag': authTag.toString('hex'),
      }
    }));
    
    return key;
  }

  async downloadAndWatermarkDocument(bucketName: string, key: string, userEmail: string, ipAddress: string): Promise<Buffer> {
    const response = await this.s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }));
    
    const iv = Buffer.from(response.Metadata!['iv'], 'hex');
    const authTag = Buffer.from(response.Metadata!['auth-tag'], 'hex');
    
    const encryptedArray = await (response.Body as any).transformToByteArray();
    const encryptedBuffer = Buffer.from(encryptedArray);
    
    // Giải mã file
    const decryptedBuffer = this.decryptBuffer(encryptedBuffer, iv, authTag);
    
    // Data Leakage Prevention: Áp dụng Dynamic Watermark cho file PDF
    if (key.toLowerCase().endsWith('.pdf') || response.ContentType === 'application/pdf') {
      return this.applyDynamicWatermark(decryptedBuffer, userEmail, ipAddress);
    }
    
    return decryptedBuffer;
  }

  async applyDynamicWatermark(pdfBuffer: Buffer, email: string, ip: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const timestamp = new Date().toISOString();
    
    // Nội dung Watermark chống chụp lén/in ấn trái phép
    const watermarkText = `STRICTLY CONFIDENTIAL\nBKS VIEW ONLY\nUser: ${email}\nIP: ${ip}\nTime: ${timestamp}`;

    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Chèn watermark dạng chéo mờ (Opacity 15%)
      page.drawText(watermarkText, {
        x: width / 2 - 180,
        y: height / 2 - 50,
        size: 28,
        color: rgb(0.8, 0.2, 0.2), // Red tint
        opacity: 0.15,
        rotate: degrees(45),
      });
    }

    const watermarkedBytes = await pdfDoc.save();
    return Buffer.from(watermarkedBytes);
  }
}
