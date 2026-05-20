import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCategoriesUseCase } from "../../application/get-all-categories.use-case";
import { getCategoriesPaginatedUseCase } from "../../application/get-categories-paginated.use-case";
import { createCategoryUseCase } from "../../application/create-category.use-case";
import { updateCategoryUseCase } from "../../application/update-category.use-case";
import { deleteCategoryUseCase } from "../../application/delete-category.use-case";
import { CreateCategoryDto, UpdateCategoryDto } from "../../domain/category.types";
import { queryKeys } from "@/lib/query-keys";
import { PageOptions } from "@/types/api";
import { toast } from "sonner";

/**
 * Hook to fetch all categories (public, non-paginated)
 */
export const useAllCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.full(),
    queryFn: () => getAllCategoriesUseCase.execute(),
  });
};

/**
 * Hook to fetch paginated categories (public)
 */
export const useCategories = (params: PageOptions = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => getCategoriesPaginatedUseCase.execute(params),
  });
};

/**
 * Hook for creating a category (admin)
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => createCategoryUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Category created successfully");
    },
  });
};

/**
 * Hook for updating a category (admin)
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      updateCategoryUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Category updated successfully");
    },
  });
};

/**
 * Hook for deleting a category (admin)
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Category deleted successfully");
    },
  });
};

/**
 * Combined mutations hook for backward compatibility or convenience
 * @deprecated Use individual hooks instead
 */
export const useCategoryMutations = () => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    isPending: createCategory.isPending || updateCategory.isPending || deleteCategory.isPending,
  };
};
