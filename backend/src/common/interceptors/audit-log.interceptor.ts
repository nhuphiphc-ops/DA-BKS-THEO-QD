import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    
    // Chỉ audit các hành động tạo/sửa/xóa (Write operations)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const user = req.user; // Được inject từ JwtAuthGuard
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];
      const payload = req.body;
      const resourceType = req.route.path;
      
      return next.handle().pipe(
        tap(async (responsePayload) => {
          if (user) {
            // Xây dựng log entry
            const beforeState = method === 'PUT' || method === 'PATCH' || method === 'DELETE' ? 'Fetching old state via subscriber or direct query needed in prod' : null;
            const afterState = method !== 'DELETE' ? responsePayload : null;
            
            // Tính toán tamper_hash (WORM & Chống sửa đổi)
            const rawString = `${user.sub}|${method}|${resourceType}|${JSON.stringify(beforeState)}|${JSON.stringify(afterState)}`;
            const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET || 'fallback_secret');
            hmac.update(rawString);
            const tamperHash = hmac.digest('hex');

            // Lưu trực tiếp vào Database thông qua TypeORM query runner (Tránh trigger ORM lifecycle nếu không cần thiết)
            await this.dataSource.query(
              `INSERT INTO bks_system_audit_logs 
               (actor_id, action_type, resource_type, ip_address, user_agent, before_state, after_state, tamper_hash)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                user.sub, // id
                method, // action_type
                resourceType, // resource_type
                ip, // ip
                userAgent, // user_agent
                beforeState ? JSON.stringify(beforeState) : null,
                afterState ? JSON.stringify(afterState) : null,
                tamperHash // Bất biến
              ]
            );
          }
        }),
      );
    }
    
    return next.handle();
  }
}
