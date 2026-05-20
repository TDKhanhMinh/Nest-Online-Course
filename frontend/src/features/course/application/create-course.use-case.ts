import { courseApi, CreateCourseDto } from "../infrastructure/course.api";
import { Course, CourseLevel } from "../domain/course.types";
import { mapCourseDtoToEntity } from "../domain/course.mapper";

export interface CreateCourseInput {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  level: CourseLevel;
  thumbnailUrl?: string;
  categoryId: string;
  language: string;
}

export class CreateCourseUseCase {
  async execute(input: CreateCourseInput): Promise<Course> {
    const dto: CreateCourseDto = {
      title: input.title,
      description: input.description,
      price: input.price,
      level: input.level,
      thumbnailUrl: input.thumbnailUrl || undefined,
      categoryId: input.categoryId,
      language: input.language,
    };
    
    const response = await courseApi.createCourse(dto);
    return mapCourseDtoToEntity(response);
  }
}

export const createCourseUseCase = new CreateCourseUseCase();
