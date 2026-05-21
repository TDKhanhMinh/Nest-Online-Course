import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { getQuestionsUseCase } from "../../application/get-questions.use-case";
import { createQuestionUseCase } from "../../application/create-question.use-case";
import { updateQuestionUseCase } from "../../application/update-question.use-case";
import { deleteQuestionUseCase } from "../../application/delete-question.use-case";
import type {
  GetQuestionsParams,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from "../../infrastructure/instructor-question.api";

/**
 * Hook to fetch a paginated list of instructor questions.
 * Supports filtering by courseId, search, pagination, and ordering.
 */
export const useInstructorQuestions = (params?: GetQuestionsParams) => {
  return useQuery({
    queryKey: queryKeys.instructor.questions.list(params ?? {}),
    queryFn: () => getQuestionsUseCase.execute(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to create a new question.
 * Automatically invalidates the question list cache on success.
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDTO) =>
      createQuestionUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.questions.all,
      });
      toast.success("Question created successfully!");
    },
  });
};

/**
 * Hook to update an existing question.
 * Automatically invalidates the question list cache on success.
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDTO }) =>
      updateQuestionUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.questions.all,
      });
      toast.success("Question updated successfully!");
    },
  });
};

/**
 * Hook to delete a question.
 * Automatically invalidates the question list cache on success.
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuestionUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.questions.all,
      });
      toast.success("Question deleted successfully!");
    },
  });
};
