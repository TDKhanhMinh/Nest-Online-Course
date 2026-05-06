import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentDocument, EnrollmentSchema } from '@/database/schemas/enrollment.schema';
import { EnrollmentMongooseRepository } from '@/api/enrollment/enrollment.repository';
import { EnrollmentMapper } from '@/api/enrollment/enrollment.mapper';
import { LessonProgressDocument, LessonProgressSchema } from '@/database/schemas/lesson-progress.schema';
import { LessonProgressMapper } from '@/api/enrollment/lesson-progress.mapper';
import { LessonProgressRepository } from '@/api/enrollment/lesson-progress.repository';
import { SesEmailNotificationAdapter } from '@/libs/email/ses-email.service';
import { EnrollmentController } from '@/api/enrollment/enrollment.controller';
import { EnrollmentService } from '@/api/enrollment/enrollment.service';
import { ENROLLMENT_REPOSITORY } from '@/common/abstractions/repositories/i-enrollment.repository';
import { ILESSON_PROGRESS_REPOSITORY } from '@/common/abstractions/repositories/i-lesson-progress.repository';
import { EMAIL_NOTIFICATION_SERVICE } from '@/common/abstractions/services/i-email-notification.service';
import { CourseModule } from '../course/course.module';
import { OnOrderSuccessHandler } from './handlers/on-order-success.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentDocument.name, schema: EnrollmentSchema },
      { name: LessonProgressDocument.name, schema: LessonProgressSchema },
    ]),
    forwardRef(() => CourseModule),
  ],
  controllers: [EnrollmentController],
  providers: [
    { provide: ENROLLMENT_REPOSITORY, useClass: EnrollmentMongooseRepository },
    { provide: ILESSON_PROGRESS_REPOSITORY, useClass: LessonProgressRepository },
    { provide: EMAIL_NOTIFICATION_SERVICE, useClass: SesEmailNotificationAdapter },
    EnrollmentMapper,
    LessonProgressMapper,
    EnrollmentService,
    OnOrderSuccessHandler,
  ],
  exports: [ENROLLMENT_REPOSITORY, ILESSON_PROGRESS_REPOSITORY, EMAIL_NOTIFICATION_SERVICE, EnrollmentService],
})
export class EnrollmentModule { }
