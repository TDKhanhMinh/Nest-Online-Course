import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseDocument, CourseSchema } from '@/database/schemas/course.schema';
import {
  SectionDocument,
  SectionSchema,
} from '@/database/schemas/section.schema';
import {
  LectureDocument,
  LectureSchema,
} from '@/database/schemas/lecture.schema';
import { ReviewDocument, ReviewSchema } from '@/database/schemas/review.schema';
import { CourseMongooseRepository } from '@/api/course/course.repository';
import { SectionRepository } from '@/api/course/section.repository';
import { LectureRepository } from '@/api/course/lecture.repository';
import { ReviewRepository } from '@/api/course/review.repository';
import { CourseMapper } from '@/api/course/course.mapper';
import { SectionMapper } from '@/api/course/section.mapper';
import { LectureMapper } from '@/api/course/lecture.mapper';
import { ReviewMapper } from '@/api/course/review.mapper';
import { MuxVideoStreamingAdapter } from '@/libs/video/mux-video.service';
import { CourseController } from '@/api/course/course.controller';
import { CourseService } from '@/api/course/course.service';
import { OnLessonCompletedHandler } from '@/api/course/events/on-lesson-completed.handler';
import { COURSE_REPOSITORY } from '@/common/abstractions/repositories/i-course.repository';
import { ISectionRepository } from '@/common/abstractions/repositories/i-section.repository';
import { ILectureRepository } from '@/common/abstractions/repositories/i-lecture.repository';
import { IReviewRepository } from '@/common/abstractions/repositories/i-review.repository';
import { VIDEO_STREAMING_SERVICE } from '@/common/abstractions/services/i-video-streaming.service';
import { EnrollmentModule } from '@/api/enrollment/enrollment.module';
import { CertificateModule } from '@/api/certificate/certificate.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseDocument.name, schema: CourseSchema },
      { name: SectionDocument.name, schema: SectionSchema },
      { name: LectureDocument.name, schema: LectureSchema },
      { name: ReviewDocument.name, schema: ReviewSchema },
    ]),
    forwardRef(() => EnrollmentModule),
    CertificateModule,
  ],
  controllers: [CourseController],
  providers: [
    { provide: COURSE_REPOSITORY, useClass: CourseMongooseRepository },
    { provide: ISectionRepository, useClass: SectionRepository },
    { provide: ILectureRepository, useClass: LectureRepository },
    { provide: IReviewRepository, useClass: ReviewRepository },
    { provide: VIDEO_STREAMING_SERVICE, useClass: MuxVideoStreamingAdapter },
    CourseMapper,
    SectionMapper,
    LectureMapper,
    ReviewMapper,
    CourseService,
    OnLessonCompletedHandler,
  ],
  exports: [
    COURSE_REPOSITORY,
    ISectionRepository,
    ILectureRepository,
    IReviewRepository,
  ],
})
export class CourseModule {}
