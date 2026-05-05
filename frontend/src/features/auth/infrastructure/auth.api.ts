import api from "@/lib/axios";

export enum Role {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface RegisterInstructorDTO extends RegisterDTO {
  biography: string;
  headline: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export const authApi = {
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post("/v1/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await api.post("/v1/auth/register", data);
    return response.data;
  },
  registerInstructor: async (data: RegisterInstructorDTO): Promise<AuthResponse> => {
    const response = await api.post("/v1/auth/register-instructor", data);
    return response.data;
  },
};
