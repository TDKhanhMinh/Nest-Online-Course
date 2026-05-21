import {
  instructorQuestionApi,
  type UpdateQuestionDTO,
  type QuestionDTO,
} from "../infrastructure/instructor-question.api";

/**
 * Use Case: Update an existing instructor question.
 * Connects Infrastructure → Presentation via TanStack Mutation.
 */
export class UpdateQuestionUseCase {
  async execute(id: string, data: UpdateQuestionDTO): Promise<QuestionDTO> {
    return await instructorQuestionApi.updateQuestion(id, data);
  }
}

export const updateQuestionUseCase = new UpdateQuestionUseCase();
