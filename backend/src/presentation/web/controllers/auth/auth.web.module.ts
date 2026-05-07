import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthApplicationModule } from '@application/auth/auth.application.module';

@Module({
  imports: [AuthApplicationModule],
  controllers: [AuthController],
})
export class AuthWebModule {}
