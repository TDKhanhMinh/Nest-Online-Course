import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseResponseDto } from '../dto/course.dto';
import { CourseStatus } from '@shared/types/course-status.enum';

@Injectable()
export class AdminUpdateCourseStatusUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(courseId: string, status: string): Promise<CourseResponseDto> {
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');

    course.updateStatus(status as CourseStatus);
    await this.courseRepo.save(course);

    return {
      id: course.id.value,
      title: course.title.value,
      slug: course.slug,
      description: course.description,
      price: course.price,
      status: course.status,
      instructorId: course.instructorId.value,
      categoryId: course.categoryId.value,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      language: course.language,
    };
  }
}
