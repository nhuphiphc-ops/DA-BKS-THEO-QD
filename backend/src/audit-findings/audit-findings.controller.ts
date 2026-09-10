import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor.js';
import { ActionPlanStatus, RiskLevel } from './entities/audit-finding.entity.js';
// Import Service giả định

@Controller('audit-findings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditFindingsController {
  
  // POST: Tạo phát hiện rủi ro - Phân quyền: SUPER_ADMIN, AUDITOR
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AUDITOR)
  @UseInterceptors(AuditLogInterceptor) // Tự động ghi WORM Log
  createFinding(@Body() createDto: { title: string; description: string; risk_level: RiskLevel; target_deadline: string }) {
    // Gọi Service mã hóa AES-256 field description trước khi lưu DB
    return { message: 'Đã tạo rủi ro và mã hóa description mức DB thành công.' };
  }

  // GET: Xem danh sách rủi ro - Phân quyền: Ai cũng xem được danh sách của mình
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AUDITOR, UserRole.AUDIT_TARGET)
  findAll() {
    // Audit Target chỉ xem được những rủi ro gán cho bộ phận của họ
    // Super Admin / Auditor xem được toàn bộ
    return [];
  }

  // PATCH: Cập nhật tiến độ khắc phục rủi ro - Phân quyền: AUDIT_TARGET (Đối tượng kiểm soát)
  @Patch(':id/remediation')
  @Roles(UserRole.AUDIT_TARGET)
  @UseInterceptors(AuditLogInterceptor)
  updateRemediationStatus(@Param('id') id: string, @Body() updateDto: { status: ActionPlanStatus }) {
    // Đối tượng kiểm soát gửi báo cáo khắc phục
    return { message: 'Đã cập nhật trạng thái khắc phục kiến nghị.' };
  }

  // PATCH: Duyệt đóng rủi ro - Phân quyền: SUPER_ADMIN (Trưởng ban)
  @Patch(':id/approve-closure')
  @Roles(UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditLogInterceptor)
  approveClosure(@Param('id') id: string) {
    // Trưởng BKS kiểm tra chứng từ và chốt rủi ro
    return { message: 'Trưởng BKS đã phê duyệt đóng rủi ro thành công.' };
  }
}
