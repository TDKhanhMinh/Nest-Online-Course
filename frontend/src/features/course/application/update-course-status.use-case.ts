import { courseApi, CourseDTO } from "../infrastructure/course.api";
import { Course, CourseStatus } from "../domain/course.types";
import { mapCourseDtoToEntity } from "../domain/course.mapper";

export interface UpdateCourseStatusInput {
  status: CourseStatus;
}

export class UpdateCourseStatusUseCase {
  async execute(id: string, input: UpdateCourseStatusInput): Promise<Course> {
    const response = await courseApi.updateCourseStatus(id, input);
    return mapCourseDtoToEntity(response);
  }
}

export const updateCourseStatusUseCase = new UpdateCourseStatusUseCase();

