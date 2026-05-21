import { Module } from '@nestjs/common';
import { AddQuestionToQuizUseCase } from './use-cases/add-question-to-quiz.use-case';
import { CreateOrUpdateQuizUseCase } from './use-cases/create-or-update-quiz.use-case';
import { CreateQuestionUseCase } from './use-cases/create-question.use-case';
import { DeleteQuestionUseCase } from './use-cases/delete-question.use-case';
import { GetInstructorQuestionsUseCase } from './use-cases/get-instructor-questions.use-case';
import { GetQuizByLessonUseCase } from './use-cases/get-quiz-by-lesson.use-case';
import { RemoveQuestionFromQuizUseCase } from './use-cases/remove-question-from-quiz.use-case';
import { StartQuizAttemptUseCase } from './use-cases/start-quiz-attempt.use-case';
import { SubmitQuizAttemptUseCase } from './use-cases/submit-quiz-attempt.use-case';
import { UpdateQuestionUseCase } from './use-cases/update-question.use-case';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  DeleteQuestionUseCase,
  GetInstructorQuestionsUseCase,
  CreateOrUpdateQuizUseCase,
  AddQuestionToQuizUseCase,
  RemoveQuestionFromQuizUseCase,
  GetQuizByLessonUseCase,
  StartQuizAttemptUseCase,
  SubmitQuizAttemptUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class QuizApplicationModule {}
