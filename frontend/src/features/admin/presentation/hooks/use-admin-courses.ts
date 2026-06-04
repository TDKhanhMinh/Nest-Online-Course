import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAdminCoursesUseCase, 
  getAdminCourseDetailUseCase,
  updateCourseStatusUseCase, 
  updateCourseCategoryUseCase,
  deleteCourseUseCase 
} from "../../application/admin-course.use-cases";
import { queryKeys } from "@/lib/query-keys";
import type { AdminCourseQuery, AdminCourseStatus } from "../../infrastructure/admin-course.api";
import { toast } from "sonner";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error && error.message ? error.message : fallback;
};

export const useAdminCourses = (params: AdminCourseQuery) => {
  return useQuery({
    queryKey: queryKeys.admin.courseList(params),
    queryFn: () => getAdminCoursesUseCase.execute(params),
  });
};

export const useAdminCourseDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.admin.courseDetail(id),
    queryFn: () => getAdminCourseDetailUseCase.execute(id),
    enabled: enabled && !!id,
  });
};

export const useAdminCourseMutations = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminCourseStatus }) => 
      updateCourseStatusUseCase.execute(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() });
      toast.success("Cập nhật trạng thái khóa học thành công");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Không thể cập nhật trạng thái"));
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string }) => 
      updateCourseCategoryUseCase.execute(id, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() });
      toast.success("Cập nhật danh mục khóa học thành công");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Không thể cập nhật danh mục"));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourseUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() });
      toast.success("Xóa khóa học thành công");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Không thể xóa khóa học"));
    }
  });

  return {
    updateStatus: updateStatusMutation,
    updateCategory: updateCategoryMutation,
    deleteCourse: deleteMutation,
    isUpdating: updateStatusMutation.isPending || updateCategoryMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
