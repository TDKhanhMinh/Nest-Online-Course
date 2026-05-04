import { Injectable } from '@nestjs/common';
import { Course } from '@/api/course/entities/course.entity';
import { CourseDocument } from '@/database/schemas/course.schema';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseTitle } from '@/api/course/value-objects/course-title.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';
import { LessonMapper } from '@/api/course/lesson.mapper';

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
      new UniqueId((doc._id as any).toString()),
    );
  }

  /** Domain Aggregate → plain object for Mongoose save */
  toPersistence(domain: Course): any {
    return {
      _id:         domain.id.value as any,
      title:       domain.title.value,
      description: domain.description,
      instructorId: domain.instructorId.value,
      minPassScore: domain.minPassScore.value,
      isPublished:  domain.isPublished,
      lessons:      domain.lessons.map((l) => this.lessonMapper.toPersistence(l)),
    };
  }
}
