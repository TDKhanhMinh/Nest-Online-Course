import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCourseInput, createCourseUseCase } from "../../application/create-course.use-case";
import { deleteCourseUseCase } from "../../application/delete-course.use-case";
import { UpdateCourseStatusInput, updateCourseStatusUseCase } from "../../application/update-course-status.use-case";
import { UpdateCourseInput, updateCourseUseCase } from "../../application/update-course.use-case";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseInput) => createCourseUseCase.execute(data),
    onSuccess: () => {
      toast.success("Course created successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
      updateCourseUseCase.execute(id, data),
    onSuccess: (data) => {
      toast.success("Course updated successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(data.id) });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourseUseCase.execute(id),
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
    },
  });
};

export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseStatusInput }) =>
      updateCourseStatusUseCase.execute(id, data),
    onSuccess: (data) => {
      toast.success(`Course status updated to ${data.status.toLowerCase()}!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(data.id) });
    },
  });
};
