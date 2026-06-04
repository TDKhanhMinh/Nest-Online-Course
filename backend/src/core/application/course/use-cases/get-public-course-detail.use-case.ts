import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ISectionRepository, ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { ILessonRepository, ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { ICategoryRepository, ICATEGORY_REPOSITORY } from '@domain/course/ports/i-category.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseStatus } from '@shared/types/course-status.enum';
import { LessonType } from '@shared/types/lesson-type.enum';
import { PublicCourseDetailDto } from '../dto/public-course-response.dto';
import { Course } from '@domain/course/entities/course.entity';

@Injectable()
export class GetPublicCourseDetailUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(courseIdOrSlug: string): Promise<PublicCourseDetailDto> {
    let course: Course | null = null;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(courseIdOrSlug);

    if (isObjectId) {
      course = await this.courseRepo.findById(new UniqueId(courseIdOrSlug));
    } else {
      course = await this.courseRepo.findBySlug(courseIdOrSlug);
    }

    if (!course || course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException(`Course not found or not published`);
    }

    const [instructor, category, sections] = await Promise.all([
      this.userRepo.findById(course.instructorId),
      this.categoryRepo.findById(course.categoryId),
      this.sectionRepo.findByCourseId(course.id),
    ]);

    const sectionsWithLessons = await Promise.all(
      sections
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(async (section) => {
          const lessons = await this.lessonRepo.findBySectionId(section.id);
          return {
            id: section.id.value,
            courseId: section.courseId.value,
            title: section.title,
            orderIndex: section.orderIndex,
            lessons: lessons
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((l) => ({
                id: l.id.value,
                sectionId: l.sectionId.value,
                title: l.title,
                type: l.type,
                orderIndex: l.orderIndex,
                duration: l.duration,
                isFreePreview: l.isFreePreview,
                // Sanitize lesson details: only return content for free preview lessons
                contentUrl: l.isFreePreview ? (l.contentUrl || '') : '',
                textContent: l.isFreePreview ? (l.textContent || '') : '',
                videoUrl: l.isFreePreview && l.type === LessonType.VIDEO ? (l.contentUrl || '') : '',
              })),
          };
        }),
    );

    return {
      id: course.id.value,
      title: course.title.value,
      slug: course.slug,
      description: course.description,
      price: course.price,
      level: course.level,
      language: course.language,
      thumbnailUrl: course.thumbnailUrl,
      instructorId: course.instructorId.value,
      instructorName: instructor?.fullName || 'Unknown Instructor',
      categoryId: course.categoryId.value,
      categoryName: category?.name || 'Uncategorized',
      avgRating: course.averageRating || 4.5,
      totalReviews: course.totalReview || 0,
      totalStudents: course.totalEnrolled || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      author: instructor?.fullName || 'Unknown Instructor',
      category: category?.name || 'Uncategorized',
      sections: sectionsWithLessons,
    };
  }
}
