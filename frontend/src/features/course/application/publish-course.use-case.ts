import { Course } from "../domain/course.types";
import { mapCourseDtoToEntity } from "../domain/course.mapper";
import { courseApi } from "../infrastructure/course.api";

export class PublishCourseUseCase {
  async execute(id: string): Promise<Course> {
    const response = await courseApi.publishCourse(id);
    return mapCourseDtoToEntity(response);
  }
}

export const publishCourseUseCase = new PublishCourseUseCase();
