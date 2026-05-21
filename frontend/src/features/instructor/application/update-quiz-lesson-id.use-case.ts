import {
  instructorQuizApi,
  type UpdateQuizLessonIdDTO,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export class UpdateQuizLessonIdUseCase {
  async execute(
    quizId: string,
    data: UpdateQuizLessonIdDTO
  ): Promise<InstructorQuiz> {
    const quiz = await instructorQuizApi.updateQuizLessonId(quizId, data);
    return mapInstructorQuiz(quiz);
  }
}

export const updateQuizLessonIdUseCase = new UpdateQuizLessonIdUseCase();
