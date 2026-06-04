import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { IReviewRepository, IREVIEW_REPOSITORY } from '@domain/course/ports/i-review.repository';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseStatus } from '@shared/types/course-status.enum';
import { PublicReviewDto } from '../dto/public-course-response.dto';
import { Course } from '@domain/course/entities/course.entity';

@Injectable()
export class GetPublicCourseReviewsUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(IREVIEW_REPOSITORY)
    private readonly reviewRepo: IReviewRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(courseId: string): Promise<PublicReviewDto[]> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);
    let course: Course | null = null;

    if (isObjectId) {
      course = await this.courseRepo.findById(new UniqueId(courseId));
    } else {
      course = await this.courseRepo.findBySlug(courseId);
    }

    if (!course || course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException(`Course not found or not published`);
    }

    const reviews = await this.reviewRepo.findByCourseId(course.id);

    return Promise.all(
      reviews.map(async (review) => {
        const student = await this.userRepo.findById(review.studentId);
        return {
          id: review.id.value,
          courseId: review.courseId.value,
          studentId: review.studentId.value,
          studentName: student?.fullName || 'Anonymous Student',
          rating: review.rating,
          comment: review.comment || '',
          createdAt: review.createdAt,
        };
      }),
    );
  }
}
