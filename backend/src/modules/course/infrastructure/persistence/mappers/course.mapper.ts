import { Injectable } from '@nestjs/common';
import { Course } from '../../../domain/entities/course.entity';
import { CourseDocument } from '../schemas/course.schema';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { CourseTitle } from '../../../domain/value-objects/course-title.vo';
import { QuizScore } from '../../../domain/value-objects/quiz-score.vo';
import { LessonMapper } from './lesson.mapper';

@Injectable()
export class CourseMapper {
  constructor(private readonly lessonMapper: LessonMapper) {}

  /** Mongoose Document → Domain Aggregate */
  toDomain(doc: CourseDocument): Course {
    return Course.reconstitute(
      {
        title:        new CourseTitle(doc.title),
        description:  doc.description,
        instructorId: new UniqueId(doc.instructorId),
        minPassScore: new QuizScore(doc.minPassScore),
        isPublished:  doc.isPublished,
        lessons:      (doc.lessons ?? []).map((l) => this.lessonMapper.toDomain(l)),
      },
      new UniqueId(doc._id),
    );
  }

  /** Domain Aggregate → plain object for Mongoose save */
  toPersistence(domain: Course): Partial<CourseDocument> {
    return {
      _id:         domain.id.value,
      title:       domain.title.value,
      description: domain.description,
      instructorId: domain.instructorId.value,
      minPassScore: domain.minPassScore.value,
      isPublished:  domain.isPublished,
      lessons:      domain.lessons.map((l) => this.lessonMapper.toPersistence(l)),
    };
  }
}
