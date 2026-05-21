import {
  instructorQuizApi,
  type RemoveQuestionFromQuizDTO,
} from "../infrastructure/instructor-quiz.api";

export class RemoveQuestionFromQuizUseCase {
  async execute(data: RemoveQuestionFromQuizDTO): Promise<void> {
    await instructorQuizApi.removeQuestionFromQuiz(data);
  }
}

export const removeQuestionFromQuizUseCase = new RemoveQuestionFromQuizUseCase();
