import { Injectable } from '@nestjs/common';
import { Course, CourseStatus } from '@/api/course/entities/course.entity';
import { CourseDocument } from '@/database/schemas/course.schema';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseTitle } from '@/api/course/value-objects/course-title.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';

@Injectable()
export class CourseMapper {
  /** Mongoose Document → Domain Aggregate */
  toDomain(doc: CourseDocument): Course {
    return Course.reconstitute(
      {
        title:        new CourseTitle(doc.title),
        subtitle:     doc.subtitle,
        description:  doc.description,
        instructorId: new UniqueId(doc.instructorId),
        priceTier:    doc.priceTier,
        status:       doc.status as CourseStatus,
        minPassScore: new QuizScore(doc.minPassScore),
        isPublished:  doc.isPublished,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  /** Domain Aggregate → plain object for Mongoose save */
  toPersistence(domain: Course): any {
    return {
      _id:         domain.id.value as any,
      title:       domain.title.value,
      subtitle:    domain.subtitle,
      description: domain.description,
      instructorId: domain.instructorId.value,
      priceTier:    domain.priceTier,
      status:       domain.status,
      minPassScore: domain.minPassScore.value,
      isPublished:  domain.isPublished,
    };
  }
}
