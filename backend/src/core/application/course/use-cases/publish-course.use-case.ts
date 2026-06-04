import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import {
  ICourseRepository,
  ICOURSE_REPOSITORY,
} from '@domain/course/ports/i-course.repository';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseStatus } from '@shared/types/course-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CourseResponseDto } from '../dto/course.dto';

@Injectable()
export class PublishCourseUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(
    instructorId: string,
    courseId: string,
  ): Promise<CourseResponseDto> {
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException(
        'You do not have permission to publish this course',
      );
    }

    if (course.status === CourseStatus.PUBLISHED) {
      throw new DomainException(
        ErrorCode.COURSE_ALREADY_PUBLISHED,
        'Course is already published',
      );
    }

    if (!course.thumbnailUrl) {
      throw new DomainException(
        ErrorCode.COURSE_NOT_READY_FOR_REVIEW,
        'Cannot submit course for approval without a thumbnail',
      );
    }

    course.submitForApproval();
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
