import { Injectable } from '@nestjs/common';
import { LessonProgress } from './entities/lesson-progress.entity';
import { LessonProgressDocument } from '@/database/schemas/lesson-progress.schema';

@Injectable()
export class LessonProgressMapper {
  public toDomain(doc: LessonProgressDocument): LessonProgress {
    return LessonProgress.reconstitute(
      {
        enrollmentId: doc.enrollmentId.toString(),
        lessonId: doc.lessonId.toString(),
        isCompleted: doc.isCompleted,
        completedAt: doc.completedAt,
      },
      (doc._id as any).toString(),
    );
  }

  public toPersistence(domain: LessonProgress): any {
    return {
      _id: domain.id.value,
      enrollmentId: domain.enrollmentId,
      lessonId: domain.lessonId,
      isCompleted: domain.isCompleted,
      completedAt: domain.completedAt,
    };
  }
}
