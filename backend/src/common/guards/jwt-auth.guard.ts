import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Extract token
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Không tìm thấy Token hoặc Token không hợp lệ');
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super-secret-bks-key-2026'
      });
      // Gán payload vào request để các controller dùng
      (request as any).user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token đã hết hạn hoặc không hợp lệ');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
