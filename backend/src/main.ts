import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global validation pipe with Vietnamese messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS
  app.enableCors();

  // Serve static uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API thương mại điện tử Thegioididong')
    .setDescription('Tài liệu API cho hệ thống bán điện thoại, laptop, phụ kiện')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Xác thực', 'Đăng nhập, làm mới token')
    .addTag('Người dùng', 'Quản lý người dùng hệ thống')
    .addTag('Danh mục', 'Quản lý danh mục sản phẩm')
    .addTag('Thương hiệu', 'Quản lý thương hiệu')
    .addTag('Sản phẩm', 'Quản lý sản phẩm, SKU, thông số')
    .addTag('Thông số kỹ thuật', 'Quản lý định nghĩa thông số theo danh mục')
    .addTag('Kho hàng', 'Quản lý tồn kho, xuất nhập kho')
    .addTag('Khuyến mãi', 'Quản lý chương trình khuyến mãi')
    .addTag('Thư viện media', 'Quản lý file ảnh, thư mục media')
    .addTag('Trang nội dung', 'Quản lý trang tĩnh: bảo hành, đổi trả, ...')
    .addTag('Bài viết', 'Quản lý bài viết, danh mục bài viết, tag')
    .addTag('Giỏ hàng', 'Xác thực giỏ hàng')
    .addTag('Đơn hàng', 'Đặt hàng, tra cứu, quản lý đơn hàng')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
