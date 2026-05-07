import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { ISectionRepository, ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteSectionUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
  ) {}

  async execute(instructorId: string, courseId: string, sectionId: string): Promise<void> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Delete
    await this.sectionRepo.delete(new UniqueId(sectionId));
  }
}
