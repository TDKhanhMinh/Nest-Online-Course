import { Section } from '@domain/course/entities/section.entity';
import { SectionDocument } from '@/database/schemas/section.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class SectionMapper {
  static toDomain(doc: SectionDocument): Section {
    return Section.reconstitute(
      {
        courseId: new UniqueId(doc.courseId.toString()),
        title: doc.title,
        orderIndex: doc.orderIndex,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Section): any {
    return {
      _id: domain.id.value,
      courseId: domain.courseId.value,
      title: domain.title,
      orderIndex: domain.orderIndex,
    };
  }
}
