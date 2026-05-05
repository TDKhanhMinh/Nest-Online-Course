import { Review } from '@/api/course/entities/review.entity';

export const IReviewRepository = Symbol('IReviewRepository');

export interface IReviewRepository {
  findById(id: string): Promise<Review | null>;
  findByCourseId(courseId: string): Promise<Review[]>;
  save(review: Review): Promise<void>;
  delete(id: string): Promise<void>;
}
