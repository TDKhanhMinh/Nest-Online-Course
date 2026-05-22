import { Course } from "../domain/course.types";
import { courseApi } from "../infrastructure/course.api";
import { mapCourseDtoToEntity } from "../domain/course.mapper";

export class GetCourseDetailUseCase {
  async execute(id: string): Promise<Course> {
    const response = await courseApi.getCourseById(id);
    return mapCourseDtoToEntity(response);
  }
}

export const getCourseDetailUseCase = new GetCourseDetailUseCase();
