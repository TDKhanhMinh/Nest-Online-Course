import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { GetPublicCoursesUseCase } from '@application/course/use-cases/get-public-courses.use-case';
import { GetPublicCourseDetailUseCase } from '@application/course/use-cases/get-public-course-detail.use-case';
import { GetPublicCourseReviewsUseCase } from '@application/course/use-cases/get-public-course-reviews.use-case';
import { PublicCourseQueryDto } from '@application/course/dto/public-course-query.dto';

@Controller({
  path: 'public/courses',
  version: '1',
})
export class PublicCourseController {
  constructor(
    private readonly getPublicCoursesUseCase: GetPublicCoursesUseCase,
    private readonly getPublicCourseDetailUseCase: GetPublicCourseDetailUseCase,
    private readonly getPublicCourseReviewsUseCase: GetPublicCourseReviewsUseCase,
  ) {}

  @Get()
  async getPublicCourses(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: PublicCourseQueryDto,
  ) {
    return this.getPublicCoursesUseCase.execute(query);
  }

  @Get(':courseId/reviews')
  async getReviews(@Param('courseId') courseId: string) {
    return this.getPublicCourseReviewsUseCase.execute(courseId);
  }

  @Get(':courseIdOrSlug')
  async getPublicCourseDetail(@Param('courseIdOrSlug') courseIdOrSlug: string) {
    return this.getPublicCourseDetailUseCase.execute(courseIdOrSlug);
  }
}
