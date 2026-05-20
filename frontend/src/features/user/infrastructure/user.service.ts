import api from "@/lib/axios";
import { UpdateUserDto, User, UserPaginationResponse } from "../domain/user.types";

export const userService = {
  getAll: async (params: { limit?: number; offset?: number; search?: string }): Promise<UserPaginationResponse> => {
    const response = await api.get<UserPaginationResponse>("/users", { params });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
