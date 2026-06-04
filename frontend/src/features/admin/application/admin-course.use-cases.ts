import { Course } from "@/features/course/domain/course.types";
import {
  adminCourseApi,
  AdminCourseDTO,
  AdminCourseQuery,
  AdminCourseStatus,
  AdminCourseDetailDTO,
} from "../infrastructure/admin-course.api";

export interface Pagination {
  itemCount: number;
  page: number;
  limit: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedCourses {
  data: Course[];
  pagination: Pagination;
}

export class GetAdminCoursesUseCase {
  async execute(params: AdminCourseQuery): Promise<PaginatedCourses> {
    const response = await adminCourseApi.getAll(params);
    
    return {
      data: response.data.map(course => this.mapToEntity(course)),
      pagination: {
        itemCount: response.pagination.itemCount,
        page: response.pagination.page,
        limit: response.pagination.limit,
        pageCount: response.pagination.pageCount,
        hasPreviousPage: response.pagination.hasPreviousPage,
        hasNextPage: response.pagination.hasNextPage,
      }
    };
  }

  private mapToEntity(dto: any): Course {
    const props = dto.props || {};
    return {
      id: dto.id || dto._id?.value || dto._id || "",
      title: props.title?.value || dto.title || "",
      slug: props.slug || dto.slug || "",
      description: props.description || dto.description || "",
      price: props.price !== undefined ? props.price : (dto.price ?? 0),
      level: props.level || dto.level,
      status: props.status || dto.status,
      thumbnailUrl: props.thumbnailUrl || dto.thumbnailUrl,
      instructorId: props.instructorId?.value || dto.instructorId || "",
      categoryId: props.categoryId?.value || dto.categoryId || "",
      language: props.language || dto.language || "",
      avgRating: props.averageRating || dto.avgRating || 0,
      totalReviews: props.totalReview || dto.totalReviews || 0,
      totalStudents: props.totalEnrolled || dto.totalStudents || 0,
      createdAt: props.createdAt || dto.createdAt,
      updatedAt: props.updatedAt || dto.updatedAt,
      rating: props.averageRating || dto.avgRating || 0,
      thumbnail: props.thumbnailUrl || dto.thumbnailUrl || "",
    };
  }
}

export class GetAdminCourseDetailUseCase {
  async execute(id: string): Promise<AdminCourseDetailDTO> {
    return await adminCourseApi.getById(id);
  }
}

export class UpdateCourseStatusUseCase {
  async execute(id: string, status: AdminCourseStatus): Promise<Course> {
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
export const getAdminCourseDetailUseCase = new GetAdminCourseDetailUseCase();
export const updateCourseStatusUseCase = new UpdateCourseStatusUseCase();
export const updateCourseCategoryUseCase = new UpdateCourseCategoryUseCase();
export const deleteCourseUseCase = new DeleteCourseUseCase();
