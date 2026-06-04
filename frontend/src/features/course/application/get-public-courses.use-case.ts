import { courseApi } from "../infrastructure/course.api";
import { mapCourseDtoToEntity } from "../domain/course.mapper";
import { Course } from "../domain/course.types";

export class GetPublicCoursesUseCase {
  async execute(params?: any): Promise<{ courses: Course[]; pagination: any }> {
    const response = await courseApi.getPublicCourses(params);
    // Backend returns PageDto { data: T[], pagination: PageMetaDto }
    const items = response.data || [];
    const pagination = response.pagination || { total: 0, page: 1, limit: 10, total_pages: 1 };
    
    return {
      courses: items.map(mapCourseDtoToEntity),
      pagination: {
        total: pagination.itemCount || pagination.total || 0,
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total_pages: pagination.pageCount || pagination.total_pages || 1,
      },
    };
  }
}

export const getPublicCoursesUseCase = new GetPublicCoursesUseCase();
