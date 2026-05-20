import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAdminCoursesUseCase, 
  updateCourseStatusUseCase, 
  updateCourseCategoryUseCase,
  deleteCourseUseCase 
} from "../../application/admin-course.use-cases";
import { queryKeys } from "@/lib/query-keys";
import { AdminCourseQuery } from "../../infrastructure/admin-course.api";
import { CourseStatus } from "@/features/course/domain/course.types";
import { toast } from "sonner";

export const useAdminCourses = (params: AdminCourseQuery) => {
  return useQuery({
    queryKey: queryKeys.admin.courseList(params),
    queryFn: () => getAdminCoursesUseCase.execute(params),
  });
};

export const useAdminCourseMutations = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CourseStatus }) => 
      updateCourseStatusUseCase.execute(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() });
      toast.success("Cập nhật trạng thái khóa học thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể cập nhật trạng thái");
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string }) => 
      updateCourseCategoryUseCase.execute(id, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() });
      toast.success("Cập nhật danh mục khóa học thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể cập nhật danh mục");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourseUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() });
      toast.success("Xóa khóa học thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể xóa khóa học");
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
