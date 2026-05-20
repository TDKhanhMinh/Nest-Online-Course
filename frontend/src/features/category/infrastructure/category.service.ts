import api from "@/lib/axios";
import { PageDto, PageOptions } from "@/types/api";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "../domain/category.types";

export const categoryService = {
  // Public Endpoints
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories/all");
    return response.data;
  },

  getPaginated: async (params: PageOptions): Promise<PageDto<Category>> => {
    const response = await api.get<PageDto<Category>>("/categories", { params });
    return response.data;
  },

  // Admin Endpoints
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>("/admin/categories", data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};
