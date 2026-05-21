import api from "@/lib/axios";

// ==================== Enums ====================

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

// ==================== DTOs ====================

/**
 * Represents a single answer option within a question.
 */
export interface QuestionOptionDTO {
  id?: string;
  content: string;
  isCorrect: boolean;
  explanation?: string | null;
}

/**
 * Payload for creating a new question.
 * POST /instructor/questions
 */
export interface CreateQuestionDTO {
  courseId?: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: QuestionOptionDTO[];
  tags?: string[];
}

/**
 * Payload for updating an existing question.
 * PUT /instructor/questions/:id
 * Same structure as CreateQuestionDTO — full replacement.
 */
export interface UpdateQuestionDTO extends CreateQuestionDTO {}

/**
 * Represents a single question returned from the API.
 */
export interface QuestionDTO {
  id: string;
  instructorId: string;
  courseId?: string | null;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: QuestionOptionDTO[];
  tags?: string[];
}

/**
 * Pagination metadata returned by the list endpoint.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Paginated response wrapper for the list endpoint.
 * GET /instructor/questions
 */
export interface QuestionListResponseDTO {
  data: QuestionDTO[];
  pagination: PaginationMeta;
}

/**
 * Query parameters accepted by the list endpoint.
 */
export interface GetQuestionsParams {
  courseId?: string;
  page?: number;
  limit?: number;
  order?: Order;
  search?: string;
}

/**
 * Response payload for the delete endpoint.
 */
export interface DeleteQuestionResponseDTO {
  success: boolean;
  message: string;
}

// ==================== API Functions ====================

export const instructorQuestionApi = {
  /**
   * Fetch a paginated list of the instructor's questions.
   * GET /instructor/questions
   */
  getQuestions: async (
    params?: GetQuestionsParams
  ): Promise<QuestionListResponseDTO> => {
    const response = await api.get("/instructor/questions", { params });
    return response.data;
  },

  /**
   * Create a new question.
   * POST /instructor/questions
   */
  createQuestion: async (data: CreateQuestionDTO): Promise<QuestionDTO> => {
    const response = await api.post("/instructor/questions", data);
    return response.data;
  },

  /**
   * Update an existing question (full replace).
   * PUT /instructor/questions/:id
   */
  updateQuestion: async (
    id: string,
    data: UpdateQuestionDTO
  ): Promise<QuestionDTO> => {
    const response = await api.put(`/instructor/questions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a question by its ID.
   * DELETE /instructor/questions/:id
   */
  deleteQuestion: async (
    id: string
  ): Promise<DeleteQuestionResponseDTO> => {
    const response = await api.delete(`/instructor/questions/${id}`);
    return response.data;
  },
};

export default instructorQuestionApi;
