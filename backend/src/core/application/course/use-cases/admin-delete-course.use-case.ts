import { Inject, Injectable } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class AdminDeleteCourseUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(courseId: string): Promise<void> {
    await this.courseRepo.delete(new UniqueId(courseId));
  }
}
