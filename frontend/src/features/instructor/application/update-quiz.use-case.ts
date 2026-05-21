import {
  instructorQuizApi,
  type UpdateQuizDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class UpdateQuizUseCase {
  async execute(quizId: string, data: UpdateQuizDTO): Promise<InstructorQuiz> {
    const quiz = await instructorQuizApi.updateQuiz(quizId, data);
    return mapInstructorQuiz(quiz);
  }
}

export const updateQuizUseCase = new UpdateQuizUseCase();
