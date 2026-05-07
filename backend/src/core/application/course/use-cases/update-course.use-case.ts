import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { UpdateCourseDto, CourseResponseDto } from '../dto/course.dto';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(instructorId: string, courseId: string, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    // 1. Get course
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');

    // 2. Validate ownership
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 3. Update
    course.update({
      title: dto.title ? new CourseTitle(dto.title) : undefined,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId ? new UniqueId(dto.categoryId) : undefined,
      thumbnailUrl: dto.thumbnailUrl,
      level: dto.level as any,
      language: dto.language,
    });

    if (dto.status) {
      course.updateStatus(dto.status as any);
    }

    // 4. Save
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
