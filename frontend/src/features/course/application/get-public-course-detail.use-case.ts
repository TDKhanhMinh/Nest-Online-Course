import { Course } from "../domain/course.types";
import { courseApi } from "../infrastructure/course.api";
import { mapCourseDtoToEntity } from "../domain/course.mapper";

export class GetPublicCourseDetailUseCase {
  async execute(idOrSlug: string): Promise<Course> {
    const response = await courseApi.getPublicCourseDetail(idOrSlug);
    return mapCourseDtoToEntity(response);
  }
}

export const getPublicCourseDetailUseCase = new GetPublicCourseDetailUseCase();
