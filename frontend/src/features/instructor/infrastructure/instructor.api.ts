import api from "@/lib/axios";

/**
 * Data Transfer Object for Instructor Profile
 */
export interface InstructorProfileDTO {
  userId: string;
  headline: string;
  biography: string;
  totalStudents: number;
  website?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  expertise: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO for creating an instructor profile (for existing users)
 */
export interface CreateInstructorProfileDto {
  biography: string;
  headline: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  expertise?: string[];
}

/**
 * DTO for updating an instructor profile
 */
export interface UpdateInstructorProfileDto extends Partial<CreateInstructorProfileDto> {}

export const instructorApi = {
  /**
   * Get the current instructor's profile
   * GET /instructor-profiles/me
   */
  getMyProfile: async (): Promise<InstructorProfileDTO> => {
    const response = await api.get("/instructor-profiles/me");
    return response.data;
  },

  /**
   * Update the current instructor's profile
   * PUT /instructor-profiles/me
   */
  updateMyProfile: async (data: UpdateInstructorProfileDto): Promise<InstructorProfileDTO> => {
    const response = await api.put("/instructor-profiles/me", data);
    return response.data;
  },

  /**
   * Register as an instructor (create profile for existing user)
   * POST /instructor-profiles/register
   */
  registerInstructor: async (data: CreateInstructorProfileDto): Promise<InstructorProfileDTO> => {
    const response = await api.post("/instructor-profiles/register", data);
    return response.data;
  }
};

export default instructorApi;
