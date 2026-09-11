import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OTP } from 'otplib';

const totp = new OTP({ strategy: 'totp' });

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    // Kiểm tra khóa tài khoản tạm thời
    if (user.locked_until && user.locked_until > new Date()) {
      throw new ForbiddenException('Tài khoản đang bị khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau.');
    }

    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) {
      // Tăng số lần thử nghiệm sai
      user.failed_login_attempts += 1;
      if (user.failed_login_attempts >= 5) {
        // Khóa tài khoản trong 15 phút
        const lockoutDate = new Date();
        lockoutDate.setMinutes(lockoutDate.getMinutes() + 15);
        user.locked_until = lockoutDate;
      }
      await this.usersRepository.save(user);
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    // Reset attempts nếu đăng nhập thành công
    if (user.failed_login_attempts > 0 || user.locked_until) {
      user.failed_login_attempts = 0;
      user.locked_until = null;
      await this.usersRepository.save(user);
    }

    const { password_hash, mfa_secret, ...result } = user;
    return result;
  }

  async login(user: any, mfaCode?: string) {
    const fullUser = await this.usersRepository.findOne({ where: { id: user.id } });
    if (!fullUser) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    // Ràng buộc MFA cho toàn bộ tài khoản BKS
    if (fullUser.mfa_enabled) {
      if (!mfaCode) {
        throw new UnauthorizedException('Yêu cầu nhập mã xác thực MFA (TOTP).');
      }
      const mfaResult = await totp.verify({
        token: mfaCode,
        secret: fullUser.mfa_secret,
      });

      if (!mfaResult.valid) {
        throw new UnauthorizedException('Mã MFA không hợp lệ.');
      }
    }

    const payload = { email: user.email, sub: user.id, role: user.role, mfa_enabled: fullUser.mfa_enabled };
    
    // Cookie HttpOnly & Secure được xử lý bên Controller
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = totp.generateSecret();
    const otpauthUrl = totp.generateURI({
      issuer: 'BanKiemSoat_WebApp',
      label: user.email,
      secret,
    });

    await this.usersRepository.update(user.id, { mfa_secret: secret });

    return {
      secret,
      otpauthUrl
    };
  }
}
