import { Course, CourseLevel, CourseStatus } from "../domain/course.types";
import { courseApi, UpdateCourseDto } from "../infrastructure/course.api";

export interface UpdateCourseInput extends Partial<{
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  level: CourseLevel;
  thumbnailUrl: string;
  categoryId: string;
  language: string;
  status: CourseStatus;
}> {}

export class UpdateCourseUseCase {
  async execute(id: string, input: UpdateCourseInput): Promise<Course> {
    const dto: UpdateCourseDto = {
      title: input.title,
      description: input.description,
      price: input.price,
      level: input.level,
      thumbnailUrl: input.thumbnailUrl || undefined,
      categoryId: input.categoryId,
      language: input.language,
      status: input.status,
    };

    return await courseApi.updateCourse(id, dto);
  }
}

export const updateCourseUseCase = new UpdateCourseUseCase();

