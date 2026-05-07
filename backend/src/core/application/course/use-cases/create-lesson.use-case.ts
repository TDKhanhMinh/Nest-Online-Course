import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { ISectionRepository, ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { ILessonRepository, ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { Lesson } from '@domain/course/entities/lesson.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CreateLessonDto, LessonResponseDto } from '../dto/course-content.dto';

@Injectable()
export class CreateLessonUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ISECTION_REPOSITORY)
    private readonly sectionRepo: ISectionRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(
    instructorId: string, 
    courseId: string, 
    sectionId: string, 
    dto: CreateLessonDto
  ): Promise<LessonResponseDto> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Validate section exists
    const section = await this.sectionRepo.findById(new UniqueId(sectionId));
    if (!section) throw new NotFoundException('Section not found');

    // 3. Create entity
    const lesson = Lesson.create({
      sectionId: section.id,
      title: dto.title,
      contentUrl: dto.contentUrl,
      textContent: dto.textContent,
      type: dto.type as any,
      orderIndex: dto.orderIndex,
      duration: dto.duration,
      isFreePreview: dto.isFreePreview,
    });

    // 4. Save
    await this.lessonRepo.save(lesson);

    return {
      id: lesson.id.value,
      sectionId: lesson.sectionId.value,
      title: lesson.title,
      contentUrl: lesson.contentUrl,
      textContent: lesson.textContent,
      type: lesson.type,
      orderIndex: lesson.orderIndex,
      duration: lesson.duration,
      isFreePreview: lesson.isFreePreview,
    };
  }
}
