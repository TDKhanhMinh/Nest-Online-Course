import { Review } from '@domain/course/entities/review.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const IREVIEW_REPOSITORY = Symbol('IReviewRepository');

export interface IReviewRepository {
  findById(id: UniqueId): Promise<Review | null>;
  findByCourseId(courseId: UniqueId): Promise<Review[]>;
  save(review: Review): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}



