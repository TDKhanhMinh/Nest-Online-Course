import { Course } from "../domain/course.types";
import { courseApi, CoursePaginationDto } from "../infrastructure/course.api";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCourses {
  courses: Course[];
  pagination: Pagination;
}

export class GetInstructorCoursesUseCase {
  async execute(params?: CoursePaginationDto): Promise<PaginatedCourses> {
    const response = await courseApi.getInstructorCourses(params);
    return {
      // @ts-ignore
      courses: response,
      // @ts-ignore
      pagination: response.meta,
    };
  }
}

export const getInstructorCoursesUseCase = new GetInstructorCoursesUseCase();
