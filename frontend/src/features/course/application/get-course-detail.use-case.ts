import { Course } from "../domain/course.types";
import { courseApi } from "../infrastructure/course.api";

export class GetCourseDetailUseCase {
  async execute(id: string): Promise<Course> {
    const response = await courseApi.getCourseById(id);
    console.log("response", response);
    return response; // return mapCourseDtoToEntity(response);
  }
}

export const getCourseDetailUseCase = new GetCourseDetailUseCase();

