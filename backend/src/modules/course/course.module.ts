import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseDocument, CourseSchema } from './infrastructure/persistence/schemas/course.schema';
import { CourseMongooseRepository } from './infrastructure/persistence/repositories/course.mongoose.repository';
import { CourseMapper } from './infrastructure/persistence/mappers/course.mapper';
import { LessonMapper } from './infrastructure/persistence/mappers/lesson.mapper';
import { MuxVideoStreamingAdapter } from './infrastructure/adapters/mux-video-streaming.adapter';
import { CourseController } from './presentation/course.controller';
import { CompleteLessonUseCase } from './application/use-cases/complete-lesson/complete-lesson.use-case';
import { GetCourseProgressUseCase } from './application/use-cases/get-course-progress/get-course-progress.use-case';
import { OnLessonCompletedHandler } from './application/event-handlers/on-lesson-completed.handler';
import { COURSE_REPOSITORY } from './domain/ports/course.repository.interface';
import { VIDEO_STREAMING_SERVICE } from './application/ports/video-streaming.service.interface';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { CertificateModule } from '../certificate/certificate.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseDocument.name, schema: CourseSchema },
    ]),
    EnrollmentModule,
    CertificateModule,
  ],
  controllers: [CourseController],
  providers: [
    { provide: COURSE_REPOSITORY,       useClass: CourseMongooseRepository },
    { provide: VIDEO_STREAMING_SERVICE, useClass: MuxVideoStreamingAdapter },
    CourseMapper,
    LessonMapper,
    CompleteLessonUseCase,
    GetCourseProgressUseCase,
    OnLessonCompletedHandler,
  ],
  exports: [COURSE_REPOSITORY],
})
export class CourseModule {}
