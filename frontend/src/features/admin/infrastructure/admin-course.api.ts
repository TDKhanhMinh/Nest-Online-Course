import { CourseLevel, CourseStatus } from "@/features/course/domain/course.types";
import api from "@/lib/axios";

export interface AdminCourseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: CourseStatus;
  instructorId: string;
  categoryId: string;
  thumbnailUrl?: string;
  level: CourseLevel;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourseQuery {
  page?: number;
  limit?: number;
  status?: CourseStatus;
  categoryId?: string;
  instructorId?: string;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedAdminCourses {
  data: AdminCourseDTO[];
  meta: PaginationMeta;
}

export const adminCourseApi = {
  getAll: async (params: AdminCourseQuery): Promise<PaginatedAdminCourses> => {
    const response = await api.get("/admin/courses", { params });
    return response.data;
  },

  getById: async (id: string): Promise<AdminCourseDTO> => {
    const response = await api.get(`/admin/courses/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: CourseStatus): Promise<AdminCourseDTO> => {
    const response = await api.patch(`/admin/courses/${id}/status`, { status });
    return response.data;
  },

  updateCategory: async (id: string, categoryId: string): Promise<AdminCourseDTO> => {
    const response = await api.patch(`/admin/courses/${id}/category`, { categoryId });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/courses/${id}`);
  },
};
