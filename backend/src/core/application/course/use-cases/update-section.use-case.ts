import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { ISectionRepository, ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { UpdateSectionDto, SectionResponseDto } from '../dto/course-content.dto';

@Injectable()
export class UpdateSectionUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
  ) {}

  async execute(
    instructorId: string, 
    courseId: string, 
    sectionId: string, 
    dto: UpdateSectionDto
  ): Promise<SectionResponseDto> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Get section
    const section = await this.sectionRepo.findById(new UniqueId(sectionId));
    if (!section) throw new NotFoundException('Section not found');

    // 3. Update
    section.update(dto);

    // 4. Save
    await this.sectionRepo.save(section);

    return {
      id: section.id.value,
      courseId: section.courseId.value,
      title: section.title,
      orderIndex: section.orderIndex,
    };
  }
}
