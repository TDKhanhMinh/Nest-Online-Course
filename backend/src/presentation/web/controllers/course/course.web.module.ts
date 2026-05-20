import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { AdminCourseController } from './admin-course.controller';
import { CategoryController } from './category.controller';
import { AdminCategoryController } from './admin-category.controller';
import { CourseApplicationModule } from '@application/course/course.application.module';

@Module({
  imports: [CourseApplicationModule],
  controllers: [
    CourseController, 
    AdminCourseController,
    CategoryController,
    AdminCategoryController
  ],
})
export class CourseWebModule {}
