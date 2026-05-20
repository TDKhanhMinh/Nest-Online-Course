import api from "@/lib/axios";

import { CourseLevel, CourseStatus } from "../domain/course.types";

export interface CourseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: CourseLevel;
  status: CourseStatus;
  thumbnailUrl?: string;
  instructorId: string;
  categoryId: string;
  language: string;
  avgRating: number;
  totalReviews: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  thumbnailUrl?: string;
  categoryId: string;
  language: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  status?: CourseStatus;
}

export interface LessonDTO {
  id: string;
  sectionId: string;
  title: string;
  type: string;
  orderIndex: number;
  textContent?: string;
  contentUrl?: string;
  duration?: number;
  isFreePreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionDTO {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: LessonDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionDto {
  title: string;
}

export interface UpdateSectionDto {
  title: string;
}

export interface CreateLessonDto {
  title: string;
  type: string;
  orderIndex: number;
  textContent?: string;
  contentUrl?: string;
  duration?: number;
  isFreePreview?: boolean;
}

export interface UpdateLessonDto extends Partial<CreateLessonDto> {}

export interface UpdateCourseStatusDto {
  status: CourseStatus;
}

export interface CoursePaginationDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: CourseStatus;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedCourses {
  courses: CourseDTO[];
  pagination: PaginationMeta;
}

export const courseApi = {
  createCourse: async (data: CreateCourseDto): Promise<CourseDTO> => {
    const response = await api.post("/courses", data);
    return response.data;
  },
  
  getInstructorCourses: async (params?: CoursePaginationDto): Promise<PaginatedCourses> => {
    const response = await api.get("/courses/instructor/my-courses", { params });
    return response.data;
  },
  
  getCourseById: async (id: string): Promise<CourseDTO> => {
    const response = await api.get(`/courses/${id}/content`);
    return response.data;
  },

  getCourseForManagement: async (id: string): Promise<CourseDTO> => {
    const response = await api.get(`/courses/${id}/manage`);
    return response.data;
  },
  
  updateCourse: async (id: string, data: UpdateCourseDto): Promise<CourseDTO> => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },
  
  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
  
  updateCourseStatus: async (id: string, data: UpdateCourseStatusDto): Promise<CourseDTO> => {
    const response = await api.patch(`/courses/${id}/status`, data);
    return response.data;
  },
  
  // Curriculum - Sections
  getCourseCurriculum: async (courseId: string): Promise<SectionDTO[]> => {
    const response = await api.get(`/courses/${courseId}/manage`);
    // Note: The manage endpoint returns the full course content including sections
    return response.data.sections || [];
  },

  createSection: async (courseId: string, data: CreateSectionDto): Promise<SectionDTO> => {
    const response = await api.post(`/courses/${courseId}/sections`, data);
    return response.data;
  },

  updateSection: async (courseId: string, sectionId: string, data: UpdateSectionDto): Promise<SectionDTO> => {
    const response = await api.put(`/courses/${courseId}/sections/${sectionId}`, data);
    return response.data;
  },

  deleteSection: async (courseId: string, sectionId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/sections/${sectionId}`);
  },

  // Curriculum - Lessons
  createLesson: async (courseId: string, sectionId: string, data: CreateLessonDto): Promise<LessonDTO> => {
    const response = await api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, data);
    return response.data;
  },

  updateLesson: async (courseId: string, lessonId: string, data: UpdateLessonDto): Promise<LessonDTO> => {
    const response = await api.put(`/courses/${courseId}/lessons/${lessonId}`, data);
    return response.data;
  },

  deleteLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
  },
};


