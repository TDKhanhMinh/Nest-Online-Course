import { Injectable } from '@nestjs/common';
import { Review } from '@/api/course/entities/review.entity';
import { ReviewDocument } from '@/database/schemas/review.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class ReviewMapper {
  toDomain(doc: ReviewDocument): Review {
    return Review.create(
      {
        courseId: new UniqueId(doc.courseId.toString()),
        studentId: new UniqueId(doc.studentId.toString()),
        rating: doc.rating,
        comment: doc.comment,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: Review): any {
    return {
      _id: domain.id.value as any,
      courseId: domain.courseId.value,
      studentId: domain.studentId.value,
      rating: domain.rating,
      comment: domain.comment,
    };
  }
}
