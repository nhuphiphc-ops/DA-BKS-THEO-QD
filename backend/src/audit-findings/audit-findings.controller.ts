import { Controller, Get, Post, Body, Patch, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditFinding, RiskLevel, ActionPlanStatus } from './entities/audit-finding.entity.js';

@Controller('audit-findings')
@UseGuards(JwtAuthGuard)
export class AuditFindingsController {
  constructor(
    @InjectRepository(AuditFinding)
    private auditFindingsRepository: Repository<AuditFinding>,
  ) {}

  @Post()
  async createFinding(@Body() createDto: any) {
    const finding = new AuditFinding();
    finding.title = createDto.title;
    // Tạm thời lưu dạng text thô để Demo hoạt động ngay, 
    // có thể dùng TypeORM pgcrypto encrypt sau.
    // Lợi dụng bytea bằng cách lưu Buffer.from(text)
    finding.description_encrypted = Buffer.from(createDto.description || 'N/A');
    
    // Map severity to risk_level
    const severityMap: any = {
      'CRITICAL': RiskLevel.NGHIEM_TRONG,
      'HIGH': RiskLevel.CAO,
      'MEDIUM': RiskLevel.TRUNG_BINH,
      'LOW': RiskLevel.THAP
    };
    finding.risk_level = severityMap[createDto.severity] || RiskLevel.TRUNG_BINH;
    finding.action_plan_status = ActionPlanStatus.CHUA_XU_LY;
    finding.target_deadline = new Date(); // default deadline

    await this.auditFindingsRepository.save(finding);
    return finding;
  }

  @Get()
  async findAll() {
    const findings = await this.auditFindingsRepository.find({
      order: { created_at: 'DESC' }
    });

    // Trả về format mà giao diện Frontend đang cần
    return findings.map(f => {
      let severity = 'MEDIUM';
      if (f.risk_level === RiskLevel.NGHIEM_TRONG) severity = 'CRITICAL';
      if (f.risk_level === RiskLevel.CAO) severity = 'HIGH';
      if (f.risk_level === RiskLevel.THAP) severity = 'LOW';

      return {
        id: f.id,
        title: f.title,
        description: f.description_encrypted ? f.description_encrypted.toString() : '',
        severity: severity,
        status: f.action_plan_status
      };
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.auditFindingsRepository.delete(id);
    return { success: true };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const finding = await this.auditFindingsRepository.findOneBy({ id });
    if (!finding) throw new Error('Not found');

    if (updateDto.title) finding.title = updateDto.title;
    if (updateDto.description) finding.description_encrypted = Buffer.from(updateDto.description);
    
    if (updateDto.severity) {
      const severityMap: any = {
        'CRITICAL': RiskLevel.NGHIEM_TRONG,
        'HIGH': RiskLevel.CAO,
        'MEDIUM': RiskLevel.TRUNG_BINH,
        'LOW': RiskLevel.THAP
      };
      finding.risk_level = severityMap[updateDto.severity] || RiskLevel.TRUNG_BINH;
    }

    await this.auditFindingsRepository.save(finding);
    return finding;
  }
}
