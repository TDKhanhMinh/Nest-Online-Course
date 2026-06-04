import api from "@/lib/axios";

export interface MyEnrollmentDto {
  enrollmentId: string;
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  price: number;
  instructorName: string;
  categoryName: string;
  progress: number;
  status: string;
  enrolledAt: string;
  completedAt?: string;
}

export interface EnrollmentStatusDto {
  enrolled: boolean;
  inCart: boolean;
  progress?: number;
  enrollmentId?: string;
}

export const enrollmentApi = {
  getMyEnrollments: async (): Promise<MyEnrollmentDto[]> => {
    const response = await api.get<MyEnrollmentDto[]>("/enrollments/my");
    return response.data;
  },

  getEnrollmentStatus: async (courseId: string): Promise<EnrollmentStatusDto> => {
    const response = await api.get<EnrollmentStatusDto>(
      `/enrollments/my/${courseId}/status`
    );
    return response.data;
  },
};
