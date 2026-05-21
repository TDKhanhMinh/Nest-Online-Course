import { Module } from '@nestjs/common';
import { InstructorQuestionController } from './instructor-question.controller';
import { InstructorQuizController } from './instructor-quiz.controller';
import { StudentQuizController } from './student-quiz.controller';
import { QuizApplicationModule } from '../../../../core/application/quiz/quiz.application.module';

@Module({
  imports: [QuizApplicationModule],
  controllers: [
    InstructorQuestionController,
    InstructorQuizController,
    StudentQuizController,
  ],
})
export class QuizWebModule {}
