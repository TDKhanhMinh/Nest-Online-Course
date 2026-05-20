import { courseApi } from "../infrastructure/course.api";
import { Course } from "../domain/course.types";
import { mapCourseDtoToEntity } from "../domain/course.mapper";

export class GetCourseManagementUseCase {
  async execute(id: string): Promise<Course> {
    const response = await courseApi.getCourseForManagement(id);
    return mapCourseDtoToEntity(response);
  }
}

export const getCourseManagementUseCase = new GetCourseManagementUseCase();
