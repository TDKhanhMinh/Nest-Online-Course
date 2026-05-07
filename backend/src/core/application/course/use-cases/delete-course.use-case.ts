import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(instructorId: string, courseId: string): Promise<void> {
    // 1. Get course
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');

    // 2. Validate ownership
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 3. Delete
    await this.courseRepo.delete(new UniqueId(courseId));
  }
}
