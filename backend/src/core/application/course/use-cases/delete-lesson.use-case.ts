import {
  ICOURSE_REPOSITORY,
  ICourseRepository
} from '@domain/course/ports/i-course.repository';
import { ISECTION_REPOSITORY, ISectionRepository } from '@domain/course/ports/i-section.repository';
import { ILESSON_REPOSITORY, ILessonRepository } from '@domain/course/ports/i-lesson.repository';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteLessonUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(instructorId: string, courseId: string, lessonId: string): Promise<void> {
    // 1. Validate course ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Validate lesson ownership and existence
    const lesson = await this.lessonRepo.findById(new UniqueId(lessonId));
    if (!lesson) throw new NotFoundException('Lesson not found');

    const section = await this.sectionRepo.findById(lesson.sectionId);
    if (!section) throw new NotFoundException('Section not found');

    if (section.courseId.value !== courseId) {
      throw new ForbiddenException('You do not have permission to manage this lesson');
    }

    course.removeLesson();

    // 3. Delete
    await this.lessonRepo.delete(new UniqueId(lessonId));
    await this.courseRepo.save(course);
  }
}
