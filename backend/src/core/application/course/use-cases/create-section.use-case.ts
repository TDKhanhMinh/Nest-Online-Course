import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { ISectionRepository, ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { Section } from '@domain/course/entities/section.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CreateSectionDto, SectionResponseDto } from '../dto/course-content.dto';

@Injectable()
export class CreateSectionUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
  ) {}

  async execute(instructorId: string, courseId: string, dto: CreateSectionDto): Promise<SectionResponseDto> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Create entity
    const section = Section.create({
      courseId: new UniqueId(courseId),
      title: dto.title,
      orderIndex: dto.orderIndex,
    });

    // 3. Save
    await this.sectionRepo.save(section);

    return {
      id: section.id.value,
      courseId: section.courseId.value,
      title: section.title,
      orderIndex: section.orderIndex,
    };
  }
}
