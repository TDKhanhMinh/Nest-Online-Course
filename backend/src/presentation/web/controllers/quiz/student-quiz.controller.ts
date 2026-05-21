import { SubmitQuizAttemptDto } from '@application/quiz/dto/submit-quiz-attempt.dto';
import { GetQuizByLessonUseCase } from '@application/quiz/use-cases/get-quiz-by-lesson.use-case';
import { StartQuizAttemptUseCase } from '@application/quiz/use-cases/start-quiz-attempt.use-case';
import { SubmitQuizAttemptUseCase } from '@application/quiz/use-cases/submit-quiz-attempt.use-case';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  JwtPayload,
} from '@presentation/web/shared/decorators/current-user.decorator';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { Role } from '@shared/types/role.enum';

@Controller({
  path: 'student',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentQuizController {
  constructor(
    private readonly getQuizByLessonUseCase: GetQuizByLessonUseCase,
    private readonly startQuizAttemptUseCase: StartQuizAttemptUseCase,
    private readonly submitQuizAttemptUseCase: SubmitQuizAttemptUseCase,
  ) {}

  @Get('quizzes/lesson/:lessonId')
  async getQuizByLesson(
    @CurrentUser() user: JwtPayload,
    @Param('lessonId') lessonId: string,
  ) {
    const quiz = await this.getQuizByLessonUseCase.execute({
      lessonId,
    });

    return {
      id: quiz.id.value,
      lessonId: quiz.lessonId.value,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      maxAttempts: quiz.maxAttempts,
      questions: quiz.questions.map((q) => ({
        questionId: q.questionId.value,
        points: q.points,
        orderIndex: q.orderIndex,
      })),
    };
  }

  @Post('quizzes/:quizId/start')
  async startAttempt(
    @CurrentUser() user: JwtPayload,
    @Param('quizId') quizId: string,
  ) {
    const attempt = await this.startQuizAttemptUseCase.execute({
      quizId,
      studentId: user.sub,
    });
    return attempt;
  }

  @Post('quiz-attempts/:attemptId/submit')
  async submitAttempt(
    @CurrentUser() user: JwtPayload,
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitQuizAttemptDto,
  ) {
    const attempt = await this.submitQuizAttemptUseCase.execute({
      attemptId,
      studentId: user.sub,
      answers: dto.answers,
    });

    return {
      success: true,
      score: attempt.score,
      isPassed: attempt.isPassed,
      submittedAt: attempt.endTime,
    };
  }
}
