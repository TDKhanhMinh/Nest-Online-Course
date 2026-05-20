import { Section } from "../domain/course.types";
import { courseApi, SectionDTO } from "../infrastructure/course.api";

export interface CreateSectionInput {
  title: string;
}

export interface UpdateSectionInput {
  title: string;
}

const mapSectionToEntity = (dto: SectionDTO): Section => {
  return {
    id: dto.id,
    courseId: dto.courseId,
    title: dto.title,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    lessons: (dto.lessons || []).map(lessonDto => ({
      id: lessonDto.id,
      sectionId: lessonDto.sectionId,
      title: lessonDto.title,
      type: lessonDto.type as any,
      order: lessonDto.orderIndex,
      content: lessonDto.textContent, 
      videoUrl: lessonDto.contentUrl,
      duration: lessonDto.duration?.toString(),
      isPreview: lessonDto.isFreePreview,
      createdAt: lessonDto.createdAt,
      updatedAt: lessonDto.updatedAt,
    })),
  };
};

export const createSectionUseCase = {
  execute: async (courseId: string, input: CreateSectionInput): Promise<Section> => {
    const response = await courseApi.createSection(courseId, input);
    return mapSectionToEntity(response);
  },
};

export const updateSectionUseCase = {
  execute: async (courseId: string, sectionId: string, input: UpdateSectionInput): Promise<Section> => {
    console.log('input', input);
    console.log('sectionId', sectionId);
    console.log('courseId', courseId);
    const response = await courseApi.updateSection(courseId, sectionId, {
      title: input.title,
    });
    return mapSectionToEntity(response);
  },
};

export const deleteSectionUseCase = {
  execute: async (courseId: string, sectionId: string): Promise<void> => {
    return courseApi.deleteSection(courseId, sectionId);
  },
};
