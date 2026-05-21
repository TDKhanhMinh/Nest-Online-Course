import {
  instructorQuizApi,
  type CreateOrUpdateQuizDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class CreateOrUpdateQuizUseCase {
  async execute(data: CreateOrUpdateQuizDTO): Promise<InstructorQuiz> {
    const quiz = await instructorQuizApi.createOrUpdateQuiz(data);
    return mapInstructorQuiz(quiz);
  }
}

export const createOrUpdateQuizUseCase = new CreateOrUpdateQuizUseCase();
