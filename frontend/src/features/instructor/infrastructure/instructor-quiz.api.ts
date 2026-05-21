import api from "@/lib/axios";

export interface UniqueIdDTO {
  value: string;
}

export interface RawQuizQuestionDTO {
  questionId: UniqueIdDTO | string;
  points: number;
  orderIndex: number;
}

export interface RawQuizPropsDTO {
  instructorId?: UniqueIdDTO | string;
  lessonId: UniqueIdDTO | string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  questions?: RawQuizQuestionDTO[];
}

export interface RawQuizDTO {
  _id?: UniqueIdDTO;
  id?: string;
  props: RawQuizPropsDTO;
  _domainEvents?: unknown[];
}

export interface CreateOrUpdateQuizDTO {
  lessonId: string;
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
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

export interface ListedQuizQuestionDTO {
  questionId: string;
  points: number;
  orderIndex: number;
}

export interface ListedQuizDTO {
  id: string;
  instructorId: string;
  lessonId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  questions: ListedQuizQuestionDTO[];
}

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
  data: ListedQuizDTO[];
  pagination: QuizPaginationMeta;
}

export const instructorQuizApi = {
  getInstructorQuizById: async (quizId: string): Promise<ListedQuizDTO> => {
    const response = await api.get(`/instructor/quizzes/${quizId}`);
    return response.data;
  },

  getInstructorQuizzes: async (
    params?: GetInstructorQuizzesParams
  ): Promise<InstructorQuizListResponseDTO> => {
    const response = await api.get("/instructor/quizzes", { params });
    return response.data;
  },

  createOrUpdateQuiz: async (
    data: CreateOrUpdateQuizDTO
  ): Promise<RawQuizDTO> => {
    const response = await api.put("/instructor/quizzes", data);
    return response.data;
  },

  addQuestionToQuiz: async (
    data: AddQuestionToQuizDTO
  ): Promise<RawQuizDTO> => {
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
