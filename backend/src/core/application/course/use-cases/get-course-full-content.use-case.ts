import { Inject, Injectable } from '@nestjs/common';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ISectionRepository, ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { ILessonRepository, ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetCourseFullContentUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(courseId: string) {
    const course = await this.courseRepo.findByIdOrThrow(new UniqueId(courseId));
    const sections = await this.sectionRepo.findByCourseId(new UniqueId(courseId));

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
                contentUrl: l.contentUrl,
                textContent: l.textContent,
                type: l.type,
                orderIndex: l.orderIndex,
                duration: l.duration,
                isFreePreview: l.isFreePreview,
              })),
          };
        }),
    );

    return {
      courseId: course.id.value,
      title: course.title.value,
      description: course.description,
      price: course.price,
      status: course.status,
      level: course.level,
      language: course.language,
      thumbnailUrl: course.thumbnailUrl,
      categoryId: course.categoryId.value,
      instructorId: course.instructorId.value,
      slug: course.slug,
      sections: sectionsWithLessons,
    };
  }
}
