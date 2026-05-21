import {
  ICOURSE_REPOSITORY,
  ICourseRepository
} from '@domain/course/ports/i-course.repository';
import { ILESSON_REPOSITORY, ILessonRepository } from '@domain/course/ports/i-lesson.repository';
import { ISECTION_REPOSITORY, ISectionRepository } from '@domain/course/ports/i-section.repository';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteSectionUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(instructorId: string, courseId: string, sectionId: string): Promise<void> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }
    const section = await this.sectionRepo.findById(new UniqueId(sectionId));
    if (!section) throw new NotFoundException('Section not found');
    if (section.courseId.value !== courseId) {
      throw new ForbiddenException('You do not have permission to manage this section');
    }

    // 2. Cascade delete lessons
    const lessons = await this.lessonRepo.findBySectionId(new UniqueId(sectionId));
    for (const lesson of lessons) {
      await this.lessonRepo.delete(lesson.id);
    }

    // 3. Delete section
    await this.sectionRepo.delete(new UniqueId(sectionId));

    // 4. Update course stats
    course.removeSection(lessons.length);
    await this.courseRepo.save(course);
  }
}
