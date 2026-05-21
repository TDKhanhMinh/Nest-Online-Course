import {
  instructorQuestionApi,
  type CreateQuestionDTO,
  type QuestionDTO,
} from "../infrastructure/instructor-question.api";

/**
 * Use Case: Create a new instructor question.
 * Connects Infrastructure → Presentation via TanStack Mutation.
 */
export class CreateQuestionUseCase {
  async execute(data: CreateQuestionDTO): Promise<QuestionDTO> {
    return await instructorQuestionApi.createQuestion(data);
  }
}

export const createQuestionUseCase = new CreateQuestionUseCase();
