import { Injectable } from '@nestjs/common';
import { Lesson } from './entities/lesson.entity';
import { LessonDocument } from '@/database/schemas/lesson.schema';

@Injectable()
export class LessonMapper {
  public toDomain(document: LessonDocument): Lesson {
    return Lesson.reconstitute(
      {
        sectionId: document.sectionId.toString(),
        title: document.title,
        type: document.type,
        contentUrl: document.contentUrl,
        textContent: document.textContent,
        duration: document.duration,
        orderIndex: document.orderIndex,
        isFreePreview: document.isFreePreview,
      },
      document._id.toString(),
    );
  }

  public toPersistence(domain: Lesson): any {
    return {
      _id: domain.id,
      sectionId: domain.sectionId,
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
