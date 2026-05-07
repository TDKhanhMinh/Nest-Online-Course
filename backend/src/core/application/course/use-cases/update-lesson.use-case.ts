import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { ILessonRepository, ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { UpdateLessonDto, LessonResponseDto } from '../dto/course-content.dto';

@Injectable()
export class UpdateLessonUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ILESSON_REPOSITORY)
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(
    instructorId: string, 
    courseId: string, 
    lessonId: string, 
    dto: UpdateLessonDto
  ): Promise<LessonResponseDto> {
    // 1. Validate ownership
    const course = await this.courseRepo.findById(new UniqueId(courseId));
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId.value !== instructorId) {
      throw new ForbiddenException('You do not have permission to manage this course');
    }

    // 2. Get lesson
    const lesson = await this.lessonRepo.findById(new UniqueId(lessonId));
    if (!lesson) throw new NotFoundException('Lesson not found');

    // 3. Update
    lesson.update(dto as any);

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
