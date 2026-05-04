import { Injectable } from '@nestjs/common';
import { Lesson } from '@/api/course/entities/lesson.entity';
import { LessonSubDocument } from '@/database/schemas/course.schema';
import { UniqueId } from '@/common/types/unique-id.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';

@Injectable()
export class LessonMapper {
  /** Mongoose sub-document → Domain Entity */
  toDomain(doc: LessonSubDocument): Lesson {
    return Lesson.reconstitute(
      {
        title:        doc.title,
        videoAssetId: doc.videoAssetId,
        order:        doc.order,
        isCompleted:  doc.isCompleted,
        lastScore:    new QuizScore(doc.lastScore),
      },
      new UniqueId(doc._id),
    );
  }

  /** Domain Entity → plain object for Mongoose sub-document */
  toPersistence(domain: Lesson): LessonSubDocument {
    return {
      _id:          domain.id.value,
      title:        domain.title,
      videoAssetId: domain.videoAssetId,
      order:        domain.order,
      isCompleted:  domain.isCompleted,
      lastScore:    domain.lastScore.value,
    } as LessonSubDocument;
  }
}
