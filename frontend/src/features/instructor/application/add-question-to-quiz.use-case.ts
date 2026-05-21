import {
  instructorQuizApi,
  type AddQuestionToQuizDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class AddQuestionToQuizUseCase {
  async execute(data: AddQuestionToQuizDTO): Promise<InstructorQuiz> {
    const quiz = await instructorQuizApi.addQuestionToQuiz(data);
    return mapInstructorQuiz(quiz);
  }
}

export const addQuestionToQuizUseCase = new AddQuestionToQuizUseCase();
