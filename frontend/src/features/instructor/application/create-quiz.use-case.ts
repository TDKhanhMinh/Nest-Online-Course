import {
  instructorQuizApi,
  type CreateQuizDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class CreateQuizUseCase {
  async execute(data: CreateQuizDTO): Promise<InstructorQuiz> {
    const quiz = await instructorQuizApi.createQuiz(data);
    return mapInstructorQuiz(quiz);
  }
}

export const createQuizUseCase = new CreateQuizUseCase();
