import { Injectable } from '@nestjs/common';
import { Course } from '@/api/course/entities/course.entity';
import { CourseDocument } from '@/database/schemas/course.schema';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseTitle } from '@/api/course/value-objects/course-title.vo';
import { CourseStatus } from '@/common/types/course-status.enum';
import { CourseLevel } from '@/common/types/course-level.enum';

@Injectable()
export class CourseMapper {
  /** Mongoose Document → Domain Aggregate */
  toDomain(doc: CourseDocument): Course {
    return Course.reconstitute(
      {
        title: new CourseTitle(doc.title),
        slug: doc.slug,
        description: doc.description,
        instructorId: new UniqueId(doc.instructorId),
        categoryId: new UniqueId(doc.categoryId),
        price: parseFloat(doc.price.toString()),
        thumbnailUrl: doc.thumbnailUrl,
        level: doc.level as CourseLevel,
        language: doc.language,
        status: doc.status as CourseStatus,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  /** Domain Aggregate → plain object for Mongoose save */
  toPersistence(domain: Course): any {
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
