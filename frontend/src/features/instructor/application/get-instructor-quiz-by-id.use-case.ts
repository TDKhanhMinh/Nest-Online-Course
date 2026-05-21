import {
  instructorQuizApi,
  type ListedQuizDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapListedInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class GetInstructorQuizByIdUseCase {
  async execute(quizId: string): Promise<InstructorQuiz> {
    const response: ListedQuizDTO =
      await instructorQuizApi.getInstructorQuizById(quizId);

    return mapListedInstructorQuiz(response);
  }
}

export const getInstructorQuizByIdUseCase =
  new GetInstructorQuizByIdUseCase();
