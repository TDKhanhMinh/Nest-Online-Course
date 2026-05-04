import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseDocument, CourseSchema } from '@/database/schemas/course.schema';
import { CourseMongooseRepository } from '@/api/course/course.repository';
import { CourseMapper } from '@/api/course/course.mapper';
import { LessonMapper } from '@/api/course/lesson.mapper';
import { MuxVideoStreamingAdapter } from '@/libs/video/mux-video.service';
import { CourseController } from '@/api/course/course.controller';
import { CourseService } from '@/api/course/course.service';
import { OnLessonCompletedHandler } from '@/api/course/events/on-lesson-completed.handler';
import { COURSE_REPOSITORY } from '@/common/abstractions/course.repository.interface';
import { VIDEO_STREAMING_SERVICE } from '@/common/abstractions/video-streaming.service.interface';
import { EnrollmentModule } from '@/api/enrollment/enrollment.module';
import { CertificateModule } from '@/api/certificate/certificate.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseDocument.name, schema: CourseSchema },
    ]),
    forwardRef(() => EnrollmentModule),
    CertificateModule,
  ],
  controllers: [CourseController],
  providers: [
    { provide: COURSE_REPOSITORY,       useClass: CourseMongooseRepository },
    { provide: VIDEO_STREAMING_SERVICE, useClass: MuxVideoStreamingAdapter },
    CourseMapper,
    LessonMapper,
    CourseService,
    OnLessonCompletedHandler,
  ],
  exports: [COURSE_REPOSITORY],
})
export class CourseModule {}
