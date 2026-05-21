import {
  instructorQuizApi,
  type InstructorQuizDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class GetInstructorQuizByIdUseCase {
  async execute(quizId: string): Promise<InstructorQuiz> {
    const response: InstructorQuizDTO =
      await instructorQuizApi.getInstructorQuizById(quizId);

    return mapInstructorQuiz(response);
  }
}

export const getInstructorQuizByIdUseCase =
  new GetInstructorQuizByIdUseCase();
