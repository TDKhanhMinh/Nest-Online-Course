import { CourseLevel, CourseStatus } from "@/features/course/domain/course.types";
import api from "@/lib/axios";

export type AdminCourseStatus =
  | CourseStatus.DRAFT
  | CourseStatus.PENDING_APPROVAL
  | CourseStatus.PUBLISHED
  | CourseStatus.REJECTED;

export interface AdminCourseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: AdminCourseStatus;
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
  status?: AdminCourseStatus;
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
  pagination: PaginationMeta;
}

export interface AdminCourseLessonDTO {
  id: string;
  sectionId: string;
  title: string;
  contentUrl?: string;
  textContent?: string;
  type: "video" | "text" | "quiz" | "assignment";
  orderIndex: number;
  duration?: number;
  isFreePreview: boolean;
}

export interface AdminCourseSectionDTO {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: AdminCourseLessonDTO[];
}

export interface AdminCourseDetailDTO {
  courseId: string;
  title: string;
  description: string;
  price: number;
  status: AdminCourseStatus;
  level: CourseLevel;
  language: string;
  thumbnailUrl?: string;
  categoryId: string;
  instructorId: string;
  slug: string;
  sections: AdminCourseSectionDTO[];
}

export const adminCourseApi = {
  getAll: async (params: AdminCourseQuery): Promise<PaginatedAdminCourses> => {
    const response = await api.get("/admin/courses", { params });
    return response.data;
  },

  getById: async (id: string): Promise<AdminCourseDetailDTO> => {
    const response = await api.get(`/admin/courses/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: AdminCourseStatus): Promise<AdminCourseDTO> => {
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
