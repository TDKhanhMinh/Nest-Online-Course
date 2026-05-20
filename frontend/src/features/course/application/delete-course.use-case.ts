import { courseApi } from "../infrastructure/course.api";

export class DeleteCourseUseCase {
  async execute(id: string): Promise<void> {
    return await courseApi.deleteCourse(id);
  }
}

export const deleteCourseUseCase = new DeleteCourseUseCase();
