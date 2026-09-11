import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Hardening: Kích hoạt Helmet (CSP, HSTS, X-Content-Type-Options)
  app.use(helmet());

  // Bật CORS cho nội bộ và Vercel
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Xác thực input toàn cục (Zod / Class-Validator)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Lọc bỏ thuộc tính không khai báo
    forbidNonWhitelisted: true, // Chặn các request có dữ liệu thừa
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
