import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseDocument, CourseSchema } from '@/database/schemas/course.schema';
import {
  SectionDocument,
  SectionSchema,
} from '@/database/schemas/section.schema';
import {
  LessonDocument,
  LessonSchema,
} from '@/database/schemas/lesson.schema';
import { ReviewDocument, ReviewSchema } from '@/database/schemas/review.schema';
import { CategoryDocument, CategorySchema } from '@/database/schemas/category.schema';
import { CourseMongooseRepository } from '@/api/course/course.repository';
import { SectionRepository } from '@/api/course/section.repository';
import { LessonRepository } from '@/api/course/lesson.repository';
import { ReviewRepository } from '@/api/course/review.repository';
import { CourseMapper } from '@/api/course/course.mapper';
import { SectionMapper } from '@/api/course/section.mapper';
import { LessonMapper } from '@/api/course/lesson.mapper';
import { ReviewMapper } from '@/api/course/review.mapper';
import { CategoryMapper } from '@/api/course/category.mapper';
import { CategoryRepository } from '@/api/course/category.repository';
import { MuxVideoStreamingAdapter } from '@/libs/video/mux-video.service';
import { CourseController } from '@/api/course/course.controller';
import { AdminCourseController } from '@/api/course/admin-course.controller';
import { CourseService } from '@/api/course/course.service';
import { OnLessonCompletedHandler } from '@/api/course/events/on-lesson-completed.handler';
import { COURSE_REPOSITORY } from '@/common/abstractions/repositories/i-course.repository';
import { ISectionRepository } from '@/common/abstractions/repositories/i-section.repository';
import { ILessonRepository } from '@/common/abstractions/repositories/i-lesson.repository';
import { IReviewRepository } from '@/common/abstractions/repositories/i-review.repository';
import { ICATEGORY_REPOSITORY } from '@/common/abstractions/repositories/i-category.repository';
import { VIDEO_STREAMING_SERVICE } from '@/common/abstractions/services/i-video-streaming.service';
import { EnrollmentModule } from '@/api/enrollment/enrollment.module';
import { CertificateModule } from '@/api/certificate/certificate.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseDocument.name, schema: CourseSchema },
      { name: SectionDocument.name, schema: SectionSchema },
      { name: LessonDocument.name, schema: LessonSchema },
      { name: ReviewDocument.name, schema: ReviewSchema },
      { name: CategoryDocument.name, schema: CategorySchema },
    ]),
    forwardRef(() => EnrollmentModule),
    forwardRef(() => CertificateModule),
  ],
  controllers: [CourseController, AdminCourseController],
  providers: [
    { provide: COURSE_REPOSITORY, useClass: CourseMongooseRepository },
    { provide: ISectionRepository, useClass: SectionRepository },
    { provide: ILessonRepository, useClass: LessonRepository },
    { provide: IReviewRepository, useClass: ReviewRepository },
    { provide: ICATEGORY_REPOSITORY, useClass: CategoryRepository },
    { provide: VIDEO_STREAMING_SERVICE, useClass: MuxVideoStreamingAdapter },
    CourseMapper,
    SectionMapper,
    LessonMapper,
    ReviewMapper,
    CategoryMapper,
    CourseService,
    OnLessonCompletedHandler,
  ],
  exports: [
    COURSE_REPOSITORY,
    ISectionRepository,
    ILessonRepository,
    IReviewRepository,
    ICATEGORY_REPOSITORY,
  ],
})
export class CourseModule {}
