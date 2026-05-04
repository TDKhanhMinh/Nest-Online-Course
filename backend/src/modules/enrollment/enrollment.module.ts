import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentDocument, EnrollmentSchema } from './infrastructure/persistence/schemas/enrollment.schema';
import { EnrollmentMongooseRepository } from './infrastructure/persistence/repositories/enrollment.mongoose.repository';
import { EnrollmentMapper } from './infrastructure/persistence/mappers/enrollment.mapper';
import { SesEmailNotificationAdapter } from './infrastructure/adapters/ses-email-notification.adapter';
import { EnrollmentController } from './presentation/enrollment.controller';
import { EnrollStudentUseCase } from './application/use-cases/enroll-student.use-case';
import { ENROLLMENT_REPOSITORY } from './domain/ports/enrollment.repository.interface';
import { EMAIL_NOTIFICATION_SERVICE } from './application/ports/email-notification.service.interface';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentDocument.name, schema: EnrollmentSchema },
    ]),
    CourseModule,
  ],
  controllers: [EnrollmentController],
  providers: [
    { provide: ENROLLMENT_REPOSITORY,      useClass: EnrollmentMongooseRepository },
    { provide: EMAIL_NOTIFICATION_SERVICE, useClass: SesEmailNotificationAdapter },
    EnrollmentMapper,
    EnrollStudentUseCase,
  ],
  exports: [ENROLLMENT_REPOSITORY, EMAIL_NOTIFICATION_SERVICE],
})
export class EnrollmentModule {}
