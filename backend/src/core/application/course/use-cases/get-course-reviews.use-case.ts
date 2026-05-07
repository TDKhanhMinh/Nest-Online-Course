import { Inject, Injectable } from '@nestjs/common';
import { 
  IReviewRepository, IREVIEW_REPOSITORY 
} from '@domain/course/ports/i-review.repository';
import { ReviewResponseDto } from '../dto/review.dto';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetCourseReviewsUseCase {
  constructor(
    @Inject(IREVIEW_REPOSITORY)
    private readonly reviewRepo: IReviewRepository,
  ) {}

  async execute(courseId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepo.findByCourseId(new UniqueId(courseId));

    return reviews.map(review => ({
      id: review.id.value,
      courseId: review.courseId.value,
      studentId: review.studentId.value,
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt,
    }));
  }
}
