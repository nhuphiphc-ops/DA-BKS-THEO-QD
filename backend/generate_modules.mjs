import fs from 'fs';
import path from 'path';

const srcPath = 'e:/DA-BKS-THEO QD/backend/src';

const write = (file, content) => fs.writeFileSync(path.join(srcPath, file), content);

// 1. auth.module.ts
write('auth/auth.module.ts', `import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '15m' }, // 15 phút idle timeout theo yêu cầu
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
`);

// 1b. auth.controller.ts
write('auth/auth.controller.ts', `import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.validateUser(body.username, body.password);
  }

  @Post('verify-mfa')
  async verifyMfa(@Body() body: any) {
    return this.authService.verifyTotp(body.userId, body.token);
  }
}
`);

// 2. users.module.ts
if (!fs.existsSync(path.join(srcPath, 'users'))) fs.mkdirSync(path.join(srcPath, 'users'));
write('users/users.module.ts', `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UsersModule {}
`);

// 3. documents.module.ts
write('documents/documents.module.ts', `import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { DocumentsController } from './documents.controller.js';

@Module({
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
`);

// 4. audit-findings.module.ts
write('audit-findings/audit-findings.module.ts', `import { Module } from '@nestjs/common';
import { AuditFindingsController } from './audit-findings.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditFinding } from './entities/audit-finding.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([AuditFinding])],
  controllers: [AuditFindingsController],
})
export class AuditFindingsModule {}
`);

// 5. audit-evidences.module.ts
write('audit-evidences/audit-evidences.module.ts', `import { Module } from '@nestjs/common';
import { AuditEvidencesController } from './audit-evidences.controller.js';
import { DocumentsModule } from '../documents/documents.module.js';

@Module({
  imports: [DocumentsModule],
  controllers: [AuditEvidencesController],
})
export class AuditEvidencesModule {}
`);

// 6. Update app.module.ts
const appModuleContent = `import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { AuditFindingsModule } from './audit-findings/audit-findings.module.js';
import { AuditEvidencesModule } from './audit-evidences/audit-evidences.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgres',
        database: configService.get<string>('DB_NAME') || 'bks_db',
        autoLoadEntities: true, // Auto load all registered entities!
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
    AuditFindingsModule,
    AuditEvidencesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
`;
write('app.module.ts', appModuleContent);

console.log("Modules generated and wired successfully!");
