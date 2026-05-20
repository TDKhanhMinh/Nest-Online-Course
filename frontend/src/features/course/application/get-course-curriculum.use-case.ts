import { Section } from "../domain/course.types";
import { courseApi } from "../infrastructure/course.api";

export class GetCourseCurriculumUseCase {
  async execute(courseId: string): Promise<Section[]> {
    const sections = await courseApi.getCourseCurriculum(courseId);
    return sections as any;
  }
}

export const getCourseCurriculumUseCase = new GetCourseCurriculumUseCase();
