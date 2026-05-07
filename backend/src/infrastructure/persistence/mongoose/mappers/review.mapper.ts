import { Review } from '@domain/course/entities/review.entity';
import { ReviewDocument } from '@/database/schemas/review.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class ReviewMapper {
  static toDomain(doc: ReviewDocument): Review {
    return Review.reconstitute(
      {
        courseId: new UniqueId(doc.courseId.toString()),
        studentId: new UniqueId(doc.studentId.toString()),
        rating: doc.rating,
        comment: doc.comment,
        createdAt: (doc as any).createdAt,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Review): any {
    return {
      _id: domain.id.value,
      courseId: domain.courseId.value,
      studentId: domain.studentId.value,
      rating: domain.rating,
      comment: domain.comment,
    };
  }
}
