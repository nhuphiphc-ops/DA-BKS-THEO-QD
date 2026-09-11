import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Get()
  async findAll() {
    const users = await this.usersRepository.find({
      order: { created_at: 'ASC' }
    });
    // Không trả về password_hash và mfa_secret
    return users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      mfa_enabled: u.mfa_enabled,
      failed_login_attempts: u.failed_login_attempts,
      locked_until: u.locked_until,
      created_at: u.created_at,
    }));
  }

  @Post()
  async create(@Body() body: any) {
    // Kiểm tra email trùng
    const existing = await this.usersRepository.findOne({ where: { email: body.email } });
    if (existing) {
      throw new ConflictException('Email "' + body.email + '" đã tồn tại trong hệ thống!');
    }

    if (!body.password || body.password.length < 6) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự!');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(body.password, salt);

    const roleMap: any = {
      'SUPER_ADMIN': UserRole.SUPER_ADMIN,
      'AUDITOR': UserRole.AUDITOR,
      'AUDIT_TARGET': UserRole.AUDIT_TARGET,
      'SYSTEM_ADMIN': UserRole.SYSTEM_ADMIN,
    };

    const user = new User();
    user.email = body.email;
    user.full_name = body.full_name;
    user.password_hash = password_hash;
    user.role = roleMap[body.role] || UserRole.AUDIT_TARGET;

    const saved = await this.usersRepository.save(user);
    const { password_hash: _, mfa_secret: __, ...result } = saved as any;
    return result;
  }

  @Put(':id/role')
  async updateRole(@Param('id') id: string, @Body() body: any) {
    const roleMap: any = {
      'SUPER_ADMIN': UserRole.SUPER_ADMIN,
      'AUDITOR': UserRole.AUDITOR,
      'AUDIT_TARGET': UserRole.AUDIT_TARGET,
      'SYSTEM_ADMIN': UserRole.SYSTEM_ADMIN,
    };
    await this.usersRepository.update(id, { role: roleMap[body.role] });
    return { success: true };
  }

  @Put(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() body: any) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(body.password, salt);
    await this.usersRepository.update(id, { password_hash, failed_login_attempts: 0, locked_until: null });
    return { success: true };
  }

  @Put(':id/unlock')
  async unlockAccount(@Param('id') id: string) {
    await this.usersRepository.update(id, { failed_login_attempts: 0, locked_until: null });
    return { success: true };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.usersRepository.delete(id);
    return { success: true };
  }
}
