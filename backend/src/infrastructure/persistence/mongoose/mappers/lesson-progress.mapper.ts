import { LessonProgress } from '@domain/enrollment/entities/lesson-progress.entity';
import { LessonProgressDocument } from '@/database/schemas/lesson-progress.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class LessonProgressMapper {
  static toDomain(doc: LessonProgressDocument): LessonProgress {
    return LessonProgress.reconstitute(
      {
        enrollmentId: new UniqueId(doc.enrollmentId.toString()),
        lessonId: new UniqueId(doc.lessonId.toString()),
        isCompleted: doc.isCompleted,
        completedAt: doc.completedAt,
        lastAccessedAt: doc.lastAccessedAt,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: LessonProgress): any {
    return {
      _id: domain.id.value,
      enrollmentId: domain.enrollmentId.value,
      lessonId: domain.lessonId.value,
      isCompleted: domain.isCompleted,
      completedAt: domain.completedAt,
      lastAccessedAt: domain.lastAccessedAt,
    };
  }
}
