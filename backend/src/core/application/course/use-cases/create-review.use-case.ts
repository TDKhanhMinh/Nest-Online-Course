import { Inject, Injectable } from '@nestjs/common';
import { IREVIEW_REPOSITORY, IReviewRepository } from '@domain/course/ports/i-review.repository';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { IEnrollmentRepository, IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { Review } from '@domain/course/entities/review.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { CreateReviewDto, ReviewResponseDto } from '../dto/review.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IREVIEW_REPOSITORY)
    private readonly reviewRepo: IReviewRepository,

    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(IENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
  ) {}

  async execute(studentId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const courseId = new UniqueId(dto.courseId);
    
    // 1. Check if course exists
    const course = await this.courseRepo.findById(courseId);
    if (!course) {
      throw new DomainException(ErrorCode.COURSE_NOT_FOUND, 'Course not found');
    }

    // 2. Check if student is enrolled
    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(
      new UniqueId(studentId),
      courseId,
    );
    if (!enrollment) {
      throw new DomainException(
        ErrorCode.NOT_ENROLLED,
        'You must be enrolled to review this course',
      );
    }

    // 3. Create review entity
    const review = Review.create({
      courseId: course.id,
      studentId: new UniqueId(studentId),
      rating: dto.rating,
      comment: dto.comment,
    });

    // 4. Save
    await this.reviewRepo.save(review);

    return {
      id: review.id.value,
      courseId: review.courseId.value,
      studentId: review.studentId.value,
      rating: review.rating,
      comment: review.comment ?? '',
      createdAt: review.createdAt,
    };
  }
}
