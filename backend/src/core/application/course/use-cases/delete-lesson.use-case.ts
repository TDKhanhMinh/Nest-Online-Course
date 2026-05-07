import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { ILessonRepository, ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteLessonUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(instructorId: string, courseId: string, lessonId: string): Promise<void> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Delete
    await this.lessonRepo.delete(new UniqueId(lessonId));
  }
}
