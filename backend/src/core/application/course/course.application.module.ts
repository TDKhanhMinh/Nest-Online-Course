import { Module } from '@nestjs/common';
import { AdminDeleteCourseUseCase } from './use-cases/admin-delete-course.use-case';
import { AdminGetAllCoursesUseCase } from './use-cases/admin-get-all-courses.use-case';
import { AdminUpdateCourseStatusUseCase } from './use-cases/admin-update-course-status.use-case';
import { CreateCourseUseCase } from './use-cases/create-course.use-case';
import { CreateLessonUseCase } from './use-cases/create-lesson.use-case';
import { CreateReviewUseCase } from './use-cases/create-review.use-case';
import { CreateSectionUseCase } from './use-cases/create-section.use-case';
import { DeleteCourseUseCase } from './use-cases/delete-course.use-case';
import { DeleteLessonUseCase } from './use-cases/delete-lesson.use-case';
import { DeleteSectionUseCase } from './use-cases/delete-section.use-case';
import { GetAllCategoriesUseCase } from './use-cases/get-all-categories.use-case';
import { GetAllCoursesCursorUseCase } from './use-cases/get-all-courses-cursor.use-case';
import { GetAllCoursesOffsetUseCase } from './use-cases/get-all-courses-offset.use-case';
import { GetCourseFullContentUseCase } from './use-cases/get-course-full-content.use-case';
import { GetCourseReviewsUseCase } from './use-cases/get-course-reviews.use-case';
import { GetInstructorCoursesUseCase } from './use-cases/get-instructor-courses.use-case';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case';
import { UpdateLessonUseCase } from './use-cases/update-lesson.use-case';
import { UpdateSectionUseCase } from './use-cases/update-section.use-case';

const useCases = [
  AdminDeleteCourseUseCase,
  AdminGetAllCoursesUseCase,
  AdminUpdateCourseStatusUseCase,
  CreateCourseUseCase,
  CreateLessonUseCase,
  CreateReviewUseCase,
  CreateSectionUseCase,
  DeleteCourseUseCase,
  DeleteLessonUseCase,
  DeleteSectionUseCase,
  GetAllCategoriesUseCase,
  GetAllCoursesCursorUseCase,
  GetAllCoursesOffsetUseCase,
  GetCourseFullContentUseCase,
  GetCourseReviewsUseCase,
  GetInstructorCoursesUseCase,
  UpdateCourseUseCase,
  UpdateLessonUseCase,
  UpdateSectionUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class CourseApplicationModule {}
