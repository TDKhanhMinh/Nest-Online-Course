import { Injectable } from '@nestjs/common';
import { Section } from '@/api/course/entities/section.entity';
import { SectionDocument } from '@/database/schemas/section.schema';

@Injectable()
export class SectionMapper {
  toDomain(doc: SectionDocument): Section {
    return Section.create(
      {
        courseId: doc.courseId.toString(),
        title: doc.title,
        order: doc.orderIndex,
      },
      (doc._id as any).toString(),
    );
  }

  toPersistence(domain: Section): any {
    return {
      _id: domain.id.value as any,
      courseId: domain.courseId,
      title: domain.title,
      orderIndex: domain.order,
    };
  }
}
