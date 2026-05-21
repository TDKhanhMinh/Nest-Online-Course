import {
  instructorQuestionApi,
  type QuestionListResponseDTO,
  type GetQuestionsParams,
} from "../infrastructure/instructor-question.api";

/**
 * Use Case: Fetch a paginated list of instructor questions.
 * Connects Infrastructure → Presentation via TanStack Query.
 */
export class GetQuestionsUseCase {
  async execute(params?: GetQuestionsParams): Promise<QuestionListResponseDTO> {
    return await instructorQuestionApi.getQuestions(params);
  }
}

export const getQuestionsUseCase = new GetQuestionsUseCase();
