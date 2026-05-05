import { Injectable } from '@nestjs/common';
import { Lecture, LectureType } from '@/api/course/entities/lecture.entity';
import { LectureDocument } from '@/database/schemas/lecture.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class LectureMapper {
  toDomain(doc: LectureDocument): Lecture {
    return Lecture.create(
      {
        sectionId: doc.sectionId.toString(),
        title: doc.title,
        type: doc.type as LectureType,
        content: doc.contentUrl,
        duration: doc.durationSeconds,
        order: doc.orderIndex,
        isPreview: doc.isPreview,
      },
      (doc._id as any).toString(),
    );
  }

  toPersistence(domain: Lecture): any {
    return {
      _id: domain.id.value as any,
      sectionId: domain.sectionId,
      title: domain.title,
      type: domain.type,
      contentUrl: domain.content,
      durationSeconds: domain.duration ?? 0,
      orderIndex: domain.order,
      isPreview: domain.isPreview,
    };
  }
}
