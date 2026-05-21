import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import { addQuestionToQuizUseCase } from "../../application/add-question-to-quiz.use-case";
import { createOrUpdateQuizUseCase } from "../../application/create-or-update-quiz.use-case";
import { getInstructorQuizByIdUseCase } from "../../application/get-instructor-quiz-by-id.use-case";
import { getInstructorQuizzesUseCase } from "../../application/get-instructor-quizzes.use-case";
import { removeQuestionFromQuizUseCase } from "../../application/remove-question-from-quiz.use-case";
import type { InstructorQuiz } from "../../application/instructor-quiz.mapper";
import type {
  AddQuestionToQuizDTO,
  CreateOrUpdateQuizDTO,
  GetInstructorQuizzesParams,
  RemoveQuestionFromQuizDTO,
} from "../../infrastructure/instructor-quiz.api";

const syncQuizCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  quiz: InstructorQuiz
) => {
  if (quiz.lessonId) {
    queryClient.setQueryData(queryKeys.instructor.quizzes.lesson(quiz.lessonId), quiz);
  }

  if (quiz.id) {
    queryClient.setQueryData(queryKeys.instructor.quizzes.detail(quiz.id), quiz);
  }
};

export const useInstructorQuizzes = (params?: GetInstructorQuizzesParams) => {
  return useQuery({
    queryKey: queryKeys.instructor.quizzes.list(params ?? {}),
    queryFn: () => getInstructorQuizzesUseCase.execute(params),
    staleTime: 1000 * 60,
  });
};

export const useInstructorQuizDetail = (quizId?: string) => {
  return useQuery({
    queryKey: queryKeys.instructor.quizzes.detail(quizId ?? ""),
    queryFn: () => getInstructorQuizByIdUseCase.execute(quizId ?? ""),
    enabled: Boolean(quizId),
    staleTime: 1000 * 60,
  });
};

export const useCreateOrUpdateInstructorQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrUpdateQuizDTO) =>
      createOrUpdateQuizUseCase.execute(data),
    onSuccess: (quiz) => {
      syncQuizCache(queryClient, quiz);
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.lists(),
      });
    },
  });
};

export const useAddQuestionToInstructorQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddQuestionToQuizDTO) =>
      addQuestionToQuizUseCase.execute(data),
    onSuccess: (quiz) => {
      syncQuizCache(queryClient, quiz);
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.lists(),
      });
    },
  });
};

export const useRemoveQuestionFromInstructorQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveQuestionFromQuizDTO) =>
      removeQuestionFromQuizUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.lists(),
      });
    },
  });
};
