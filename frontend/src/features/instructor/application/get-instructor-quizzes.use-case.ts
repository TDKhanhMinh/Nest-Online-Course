import {
  instructorQuizApi,
  type GetInstructorQuizzesParams,
  type QuizPaginationMeta,
} from "../infrastructure/instructor-quiz.api";
import {
  mapInstructorQuiz,
  type InstructorQuiz,
} from "./instructor-quiz.mapper";

export interface InstructorQuizListResult {
  data: InstructorQuiz[];
  pagination: QuizPaginationMeta;
}

export class GetInstructorQuizzesUseCase {
  async execute(
    params?: GetInstructorQuizzesParams
  ): Promise<InstructorQuizListResult> {
    const response = await instructorQuizApi.getInstructorQuizzes(params);

    return {
      data: response.data.map(mapInstructorQuiz),
      pagination: response.pagination,
    };
  }
}

export const getInstructorQuizzesUseCase = new GetInstructorQuizzesUseCase();
