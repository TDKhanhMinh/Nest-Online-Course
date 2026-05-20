import { createAdminIfNotExist } from '@/database/seeding/admin-seeding';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DomainExceptionFilter } from '@presentation/web/shared/filters/domain-exception.filter';
import { GlobalExceptionFilter } from '@presentation/web/shared/filters/global-exception.filter';
import { TransformInterceptor } from '@presentation/web/shared/interceptors/transform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  app.useGlobalFilters(
    new DomainExceptionFilter(),
    new GlobalExceptionFilter(configService),
  );

  app.enableCors();

  // Run database seeder for admin user
  await createAdminIfNotExist(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api/v1`);
}

bootstrap();



