import { 
  adminCourseApi, 
  AdminCourseDTO, 
  AdminCourseQuery, 
  PaginatedAdminCourses as PaginatedAdminCoursesDTO 
} from "../infrastructure/admin-course.api";
import { Course, CourseStatus } from "@/features/course/domain/course.types";

export interface Pagination {
  itemCount: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface PaginatedCourses {
  data: Course[];
  meta: Pagination;
}

export class GetAdminCoursesUseCase {
  async execute(params: AdminCourseQuery): Promise<PaginatedCourses> {
    const response = await adminCourseApi.getAll(params);
    
    return {
      data: response.data.map(course => this.mapToEntity(course)),
      meta: {
        itemCount: response.meta.itemCount,
        page: response.meta.page,
        limit: response.meta.limit,
        pageCount: response.meta.pageCount,
      }
    };
  }

  private mapToEntity(dto: AdminCourseDTO): Course {
    return {
      id: dto.id,
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      shortDescription: "", // Not returned in Admin DTO for now
      price: dto.price,
      level: dto.level,
      status: dto.status,
      thumbnailUrl: dto.thumbnailUrl,
      instructorId: dto.instructorId,
      categoryId: dto.categoryId,
      category: "", // Will be populated if needed
      language: dto.language,
      avgRating: 0,
      totalReviews: 0,
      totalStudents: 0,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      rating: 0,
      thumbnail: dto.thumbnailUrl || "",
    };
  }
}

export class UpdateCourseStatusUseCase {
  async execute(id: string, status: CourseStatus): Promise<Course> {
    const response = await adminCourseApi.updateStatus(id, status);
    return new GetAdminCoursesUseCase()["mapToEntity"](response);
  }
}

export class UpdateCourseCategoryUseCase {
  async execute(id: string, categoryId: string): Promise<Course> {
    const response = await adminCourseApi.updateCategory(id, categoryId);
    return new GetAdminCoursesUseCase()["mapToEntity"](response);
  }
}

export class DeleteCourseUseCase {
  async execute(id: string): Promise<void> {
    await adminCourseApi.delete(id);
  }
}

export const getAdminCoursesUseCase = new GetAdminCoursesUseCase();
export const updateCourseStatusUseCase = new UpdateCourseStatusUseCase();
export const updateCourseCategoryUseCase = new UpdateCourseCategoryUseCase();
export const deleteCourseUseCase = new DeleteCourseUseCase();
