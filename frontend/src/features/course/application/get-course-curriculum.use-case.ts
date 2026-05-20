import { courseApi, SectionDTO } from "../infrastructure/course.api";
import { Section, Lesson } from "../domain/course.types";

export class GetCourseCurriculumUseCase {
  async execute(courseId: string): Promise<Section[]> {
    const sections = await courseApi.getCourseCurriculum(courseId);
    return sections.map(section => this.mapSectionToEntity(section));
  }

  private mapSectionToEntity(dto: SectionDTO): Section {
    return {
      id: dto.id,
      courseId: dto.course_id,
      title: dto.title,
      order: dto.order_index,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      lessons: (dto.lessons || []).map(lessonDto => ({
        id: lessonDto.id,
        sectionId: lessonDto.section_id,
        title: lessonDto.title,
        type: lessonDto.type as any,
        order: lessonDto.order_index,
        content: lessonDto.text_content,
        videoUrl: lessonDto.content_url,
        duration: lessonDto.duration?.toString(),
        isPreview: lessonDto.is_free_preview,
        createdAt: lessonDto.created_at,
        updatedAt: lessonDto.updated_at,
        
      } as Lesson)),
    };
  }
}

export const getCourseCurriculumUseCase = new GetCourseCurriculumUseCase();
