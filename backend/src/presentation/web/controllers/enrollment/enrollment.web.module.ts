import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentApplicationModule } from '@application/enrollment/enrollment.application.module';

@Module({
  imports: [EnrollmentApplicationModule],
  controllers: [EnrollmentController],
})
export class EnrollmentWebModule {}
