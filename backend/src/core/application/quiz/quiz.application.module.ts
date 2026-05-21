import { Module } from '@nestjs/common';
import { AddQuestionToQuizUseCase } from './use-cases/add-question-to-quiz.use-case';
import { CreateQuizUseCase } from './use-cases/create-quiz.use-case';
import { CreateQuestionUseCase } from './use-cases/create-question.use-case';
import { DeleteQuestionUseCase } from './use-cases/delete-question.use-case';
import { GetAllQuizzesUseCase } from './use-cases/get-all-quizzes.use-case';
import { GetInstructorQuestionsUseCase } from './use-cases/get-instructor-questions.use-case';
import { GetQuizByIdUseCase } from './use-cases/get-quiz-by-id.use-case';
import { GetQuizByLessonUseCase } from './use-cases/get-quiz-by-lesson.use-case';
import { RemoveQuestionFromQuizUseCase } from './use-cases/remove-question-from-quiz.use-case';
import { StartQuizAttemptUseCase } from './use-cases/start-quiz-attempt.use-case';
import { SubmitQuizAttemptUseCase } from './use-cases/submit-quiz-attempt.use-case';
import { UpdateQuestionUseCase } from './use-cases/update-question.use-case';
import { UpdateQuizUseCase } from './use-cases/update-quiz.use-case';
import { UpdateQuizLessonIdUseCase } from './use-cases/update-quiz-lesson-id.use-case';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  DeleteQuestionUseCase,
  GetInstructorQuestionsUseCase,
  GetAllQuizzesUseCase,
  GetQuizByIdUseCase,
  CreateQuizUseCase,
  UpdateQuizUseCase,
  AddQuestionToQuizUseCase,
  RemoveQuestionFromQuizUseCase,
  GetQuizByLessonUseCase,
  StartQuizAttemptUseCase,
  SubmitQuizAttemptUseCase,
  UpdateQuizLessonIdUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class QuizApplicationModule {}
