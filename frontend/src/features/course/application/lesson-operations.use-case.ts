import { courseApi, LessonDTO } from "../infrastructure/course.api";
import { Lesson } from "../domain/course.types";

export interface CreateLessonInput {
  title: string;
  sectionId: string;
  type: string;
  order: number;
  content?: string;
  videoUrl?: string;
  duration?: string;
  isPreview?: boolean;
}

export interface UpdateLessonInput extends Partial<Omit<CreateLessonInput, 'sectionId'>> {}

const mapLessonToEntity = (dto: LessonDTO): Lesson => {
  return {
    id: dto.id,
    sectionId: dto.sectionId,
    title: dto.title,
    type: dto.type as any,
    order: dto.orderIndex,
    content: dto.textContent,
    videoUrl: dto.contentUrl,
    duration: dto.duration?.toString(),
    isPreview: dto.isFreePreview,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

export const createLessonUseCase = {
  execute: async (courseId: string, sectionId: string, input: Omit<CreateLessonInput, 'sectionId'>): Promise<Lesson> => {
    const response = await courseApi.createLesson(courseId, sectionId, {
      title: input.title,
      type: input.type,
      orderIndex: input.order,
      textContent: input.content,
      contentUrl: input.videoUrl,
      duration: input.duration ? parseInt(input.duration) : undefined,
      isFreePreview: input.isPreview,
    });
    return mapLessonToEntity(response);
  },
};

export const updateLessonUseCase = {
  execute: async (courseId: string, lessonId: string, input: UpdateLessonInput): Promise<Lesson> => {
    const response = await courseApi.updateLesson(courseId, lessonId, {
      title: input.title,
      type: input.type,
      orderIndex: input.order,
      textContent: input.content,
      contentUrl: input.videoUrl,
      duration: input.duration ? parseInt(input.duration) : undefined,
      isFreePreview: input.isPreview,
    });
    return mapLessonToEntity(response);
  },
};

export const deleteLessonUseCase = {
  execute: async (courseId: string, lessonId: string): Promise<void> => {
    return courseApi.deleteLesson(courseId, lessonId);
  },
};
