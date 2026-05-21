import api from "@/lib/axios";

export interface QuizQuestionDTO {
  questionId: string;
  points: number;
  orderIndex: number;
}

export interface InstructorQuizDTO {
  id: string;
  instructorId: string;
  lessonId: string | null;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  questions: QuizQuestionDTO[];
}

export interface CreateQuizDTO {
  lessonId?: string | null;
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
}

export interface UpdateQuizDTO {
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
}

export interface UpdateQuizLessonIdDTO {
  lessonId: string | null;
}

export interface AddQuestionToQuizDTO {
  quizId: string;
  questionId: string;
  points: number;
  orderIndex?: number;
}

export interface RemoveQuestionFromQuizDTO {
  quizId: string;
  questionId: string;
}

export type QuizOrder = "ASC" | "DESC";

export interface QuizPaginationMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetInstructorQuizzesParams {
  order?: QuizOrder;
  page?: number;
  limit?: number;
  search?: string;
}

export interface InstructorQuizListResponseDTO {
  data: InstructorQuizDTO[];
  pagination: QuizPaginationMeta;
}

export const instructorQuizApi = {
  getInstructorQuizById: async (quizId: string): Promise<InstructorQuizDTO> => {
    const response = await api.get(`/instructor/quizzes/${quizId}`);
    return response.data;
  },

  getInstructorQuizzes: async (
    params?: GetInstructorQuizzesParams
  ): Promise<InstructorQuizListResponseDTO> => {
    const response = await api.get("/instructor/quizzes", { params });
    return response.data;
  },

  createQuiz: async (data: CreateQuizDTO): Promise<InstructorQuizDTO> => {
    const response = await api.post("/instructor/quizzes", data);
    return response.data;
  },

  updateQuiz: async (
    quizId: string,
    data: UpdateQuizDTO
  ): Promise<InstructorQuizDTO> => {
    const response = await api.put(`/instructor/quizzes/${quizId}`, data);
    return response.data;
  },

  updateQuizLessonId: async (
    quizId: string,
    data: UpdateQuizLessonIdDTO
  ): Promise<InstructorQuizDTO> => {
    const response = await api.patch(
      `/instructor/quizzes/${quizId}/lesson`,
      data
    );
    return response.data;
  },

  addQuestionToQuiz: async (
    data: AddQuestionToQuizDTO
  ): Promise<InstructorQuizDTO> => {
    const response = await api.post("/instructor/quizzes/questions/add", data);
    return response.data;
  },

  removeQuestionFromQuiz: async (
    data: RemoveQuestionFromQuizDTO
  ): Promise<void> => {
    await api.post("/instructor/quizzes/questions/remove", data);
  },
};

export default instructorQuizApi;
