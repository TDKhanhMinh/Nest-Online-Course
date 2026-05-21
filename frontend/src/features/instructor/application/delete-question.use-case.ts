import {
  instructorQuestionApi,
  type DeleteQuestionResponseDTO,
} from "../infrastructure/instructor-question.api";

/**
 * Use Case: Delete an instructor question by its ID.
 * Connects Infrastructure → Presentation via TanStack Mutation.
 */
export class DeleteQuestionUseCase {
  async execute(id: string): Promise<DeleteQuestionResponseDTO> {
    return await instructorQuestionApi.deleteQuestion(id);
  }
}

export const deleteQuestionUseCase = new DeleteQuestionUseCase();
