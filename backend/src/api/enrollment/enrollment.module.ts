import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentDocument, EnrollmentSchema } from '@/database/schemas/enrollment.schema';
import { EnrollmentMongooseRepository } from '@/api/enrollment/enrollment.repository';
import { EnrollmentMapper } from '@/api/enrollment/enrollment.mapper';
import { SesEmailNotificationAdapter } from '@/libs/email/ses-email.service';
import { EnrollmentController } from '@/api/enrollment/enrollment.controller';
import { EnrollmentService } from '@/api/enrollment/enrollment.service';
import { ENROLLMENT_REPOSITORY } from '@/common/abstractions/repositories/i-enrollment.repository';
import { EMAIL_NOTIFICATION_SERVICE } from '@/common/abstractions/services/i-email-notification.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentDocument.name, schema: EnrollmentSchema },
    ]),
    forwardRef(() => CourseModule),
  ],
  controllers: [EnrollmentController],
  providers: [
    { provide: ENROLLMENT_REPOSITORY, useClass: EnrollmentMongooseRepository },
    { provide: EMAIL_NOTIFICATION_SERVICE, useClass: SesEmailNotificationAdapter },
    EnrollmentMapper,
    EnrollmentService,
  ],
  exports: [ENROLLMENT_REPOSITORY, EMAIL_NOTIFICATION_SERVICE],
})
export class EnrollmentModule { }
