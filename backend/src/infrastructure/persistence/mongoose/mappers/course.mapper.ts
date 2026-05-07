import { Course } from '@domain/course/entities/course.entity';
import { CourseDocument } from '@/database/schemas/course.schema';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { CourseStatus } from '@shared/types/course-status.enum';
import { CourseLevel } from '@shared/types/course-level.enum';

export class CourseMapper {
  static toDomain(doc: CourseDocument): Course {
    return Course.reconstitute(
      {
        title: new CourseTitle(doc.title),
        slug: doc.slug,
        description: doc.description,
        instructorId: new UniqueId(doc.instructorId.toString()),
        categoryId: new UniqueId(doc.categoryId.toString()),
        price: parseFloat(doc.price.toString()),
        thumbnailUrl: doc.thumbnailUrl,
        level: doc.level as CourseLevel,
        language: doc.language,
        status: doc.status as CourseStatus,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Course): any {
    return {
      _id: domain.id.value,
      title: domain.title.value,
      slug: domain.slug,
      description: domain.description,
      instructorId: domain.instructorId.value,
      categoryId: domain.categoryId.value,
      price: domain.price,
      thumbnailUrl: domain.thumbnailUrl,
      level: domain.level,
      language: domain.language,
      status: domain.status,
    };
  }
}
