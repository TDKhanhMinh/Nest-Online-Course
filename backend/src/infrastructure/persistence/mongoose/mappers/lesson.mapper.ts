import { Lesson } from '@domain/course/entities/lesson.entity';
import { LessonDocument } from '@/database/schemas/lesson.schema';
import { UniqueId } from '@shared/types/unique-id.vo';
import { LessonType } from '@shared/types/lesson-type.enum';

export class LessonMapper {
  static toDomain(doc: LessonDocument): Lesson {
    return Lesson.reconstitute(
      {
        sectionId: new UniqueId(doc.sectionId.toString()),
        title: doc.title,
        type: doc.type as LessonType,
        contentUrl: doc.contentUrl,
        textContent: doc.textContent,
        duration: doc.duration,
        orderIndex: doc.orderIndex,
        isFreePreview: doc.isFreePreview,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Lesson): any {
    return {
      _id: domain.id.value,
      sectionId: domain.sectionId.value,
      title: domain.title,
      type: domain.type,
      contentUrl: domain.contentUrl,
      textContent: domain.textContent,
      duration: domain.duration,
      orderIndex: domain.orderIndex,
      isFreePreview: domain.isFreePreview,
    };
  }
}
