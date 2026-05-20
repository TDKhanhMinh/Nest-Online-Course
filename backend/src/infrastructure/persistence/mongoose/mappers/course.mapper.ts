import { CourseDocument } from '@/database/schemas/course.schema';
import { Course } from '@domain/course/entities/course.entity';
import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { CourseLevel } from '@shared/types/course-level.enum';
import { CourseStatus } from '@shared/types/course-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';

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
        totalEnrolled: doc.totalEnrolled,
        totalReview: doc.totalReview,
        averageRating: doc.averageRating,
        isPublished: doc.isPublished,
        totalView: doc.totalView,
        totalLike: doc.totalLike,
        totalContent: doc.totalContent,
        totalSection: doc.totalSection,
        totalLesson: doc.totalLesson,
        totalQuiz: doc.totalQuiz,
        totalAssignment: doc.totalAssignment,
        totalLecture: doc.totalLecture,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
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
      totalEnrolled: domain.totalEnrolled,
      totalReview: domain.totalReview,
      averageRating: domain.averageRating,
      isPublished: domain.isPublished,
      totalView: domain.totalView,
      totalLike: domain.totalLike,
      totalContent: domain.totalContent,
      totalSection: domain.totalSection,
      totalLesson: domain.totalLesson,
      totalQuiz: domain.totalQuiz,
      totalAssignment: domain.totalAssignment,
      totalLecture: domain.totalLecture,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
