import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resolution, ResolutionIssuerLevel, ComplianceStatus } from './entities/resolution.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('resolutions')
@UseGuards(JwtAuthGuard)
export class ResolutionsController {
  constructor(
    @InjectRepository(Resolution)
    private resolutionsRepository: Repository<Resolution>,
  ) {}

  @Post()
  async create(@Body() createDto: any) {
    const res = new Resolution();
    res.resolution_code = createDto.resolution_code || ('NQ-' + Math.floor(Math.random()*1000));
    
    // Map levels
    const levelMap: any = {
      'DHDCD': ResolutionIssuerLevel.DHDCD,
      'HDQT': ResolutionIssuerLevel.HDQT,
      'TRUONG_BKS': ResolutionIssuerLevel.TRUONG_BKS,
    };
    res.issuer_level = levelMap[createDto.issuer_level] || ResolutionIssuerLevel.DHDCD;
    
    res.issue_date = createDto.issue_date ? new Date(createDto.issue_date) : new Date();
    
    // Map status
    const statusMap: any = {
      'DUNG_THAM_QUYEN': ComplianceStatus.DUNG_THAM_QUYEN,
      'DANG_THUC_HIEN': ComplianceStatus.DANG_THUC_HIEN,
      'VI_PHAM': ComplianceStatus.VI_PHAM,
    };
    res.compliance_status = statusMap[createDto.compliance_status] || ComplianceStatus.DUNG_THAM_QUYEN;

    res.bks_audit_notes_encrypted = Buffer.from(createDto.title || 'Kế hoạch mẫu');

    await this.resolutionsRepository.save(res);
    return res;
  }

  @Get()
  async findAll() {
    const data = await this.resolutionsRepository.find({
      order: { created_at: 'DESC' }
    });

    return data.map(item => ({
      id: item.id,
      resolution_code: item.resolution_code,
      title: item.bks_audit_notes_encrypted ? item.bks_audit_notes_encrypted.toString() : '',
      issuer_level: item.issuer_level,
      status: item.compliance_status
    }));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const res = await this.resolutionsRepository.findOneBy({ id });
    if (!res) throw new Error('Not found');

    if (updateDto.resolution_code) res.resolution_code = updateDto.resolution_code;
    if (updateDto.title) res.bks_audit_notes_encrypted = Buffer.from(updateDto.title);
    
    if (updateDto.issuer_level) {
      const levelMap: any = {
        'DHDCD': ResolutionIssuerLevel.DHDCD,
        'HDQT': ResolutionIssuerLevel.HDQT,
        'TRUONG_BKS': ResolutionIssuerLevel.TRUONG_BKS,
      };
      res.issuer_level = levelMap[updateDto.issuer_level] || ResolutionIssuerLevel.DHDCD;
    }

    if (updateDto.compliance_status) {
      const statusMap: any = {
        'DUNG_THAM_QUYEN': ComplianceStatus.DUNG_THAM_QUYEN,
        'DANG_THUC_HIEN': ComplianceStatus.DANG_THUC_HIEN,
        'VI_PHAM': ComplianceStatus.VI_PHAM,
      };
      res.compliance_status = statusMap[updateDto.compliance_status] || ComplianceStatus.DUNG_THAM_QUYEN;
    }

    await this.resolutionsRepository.save(res);
    return res;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.resolutionsRepository.delete(id);
    return { success: true };
  }
}
