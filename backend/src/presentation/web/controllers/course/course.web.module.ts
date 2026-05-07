import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { AdminCourseController } from './admin-course.controller';
import { CourseApplicationModule } from '@application/course/course.application.module';

@Module({
  imports: [CourseApplicationModule],
  controllers: [CourseController, AdminCourseController],
})
export class CourseWebModule {}
