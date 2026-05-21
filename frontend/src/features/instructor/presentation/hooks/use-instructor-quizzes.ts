import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import { addQuestionToQuizUseCase } from "../../application/add-question-to-quiz.use-case";
import { createQuizUseCase } from "../../application/create-quiz.use-case";
import { getInstructorQuizByIdUseCase } from "../../application/get-instructor-quiz-by-id.use-case";
import { getInstructorQuizzesUseCase } from "../../application/get-instructor-quizzes.use-case";
import { removeQuestionFromQuizUseCase } from "../../application/remove-question-from-quiz.use-case";
import { updateQuizLessonIdUseCase } from "../../application/update-quiz-lesson-id.use-case";
import { updateQuizUseCase } from "../../application/update-quiz.use-case";
import type { InstructorQuiz } from "../../application/instructor-quiz.mapper";
import type {
  AddQuestionToQuizDTO,
  CreateQuizDTO,
  GetInstructorQuizzesParams,
  RemoveQuestionFromQuizDTO,
  UpdateQuizDTO,
  UpdateQuizLessonIdDTO,
} from "../../infrastructure/instructor-quiz.api";

const syncQuizCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  quiz: InstructorQuiz,
  previousLessonId?: string | null
) => {
  if (previousLessonId && previousLessonId !== quiz.lessonId) {
    queryClient.removeQueries({
      queryKey: queryKeys.instructor.quizzes.lesson(previousLessonId),
      exact: true,
    });
  }

  if (quiz.lessonId) {
    queryClient.setQueryData(
      queryKeys.instructor.quizzes.lesson(quiz.lessonId),
      quiz
    );
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

export const useCreateInstructorQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizDTO) => createQuizUseCase.execute(data),
    onSuccess: (quiz) => {
      syncQuizCache(queryClient, quiz);
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.lists(),
      });
    },
  });
};

export const useUpdateInstructorQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: UpdateQuizDTO }) =>
      updateQuizUseCase.execute(quizId, data),
    onSuccess: (quiz) => {
      syncQuizCache(queryClient, quiz);
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.lists(),
      });
    },
  });
};

export const useUpdateInstructorQuizLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      data,
    }: {
      quizId: string;
      data: UpdateQuizLessonIdDTO;
      previousLessonId?: string | null;
    }) => updateQuizLessonIdUseCase.execute(quizId, data),
    onSuccess: (quiz, variables) => {
      syncQuizCache(queryClient, quiz, variables.previousLessonId);
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.instructor.quizzes.detail(variables.quizId),
      });
    },
  });
};
