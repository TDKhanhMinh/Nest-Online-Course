import { AddQuestionToQuizDto } from '@application/quiz/dto/add-question-to-quiz.dto';
import { CreateOrUpdateQuizDto } from '@application/quiz/dto/create-or-update-quiz.dto';
import { RemoveQuestionFromQuizDto } from '@application/quiz/dto/remove-question-from-quiz.dto';
import { AddQuestionToQuizUseCase } from '@application/quiz/use-cases/add-question-to-quiz.use-case';
import { CreateOrUpdateQuizUseCase } from '@application/quiz/use-cases/create-or-update-quiz.use-case';
import { GetAllQuizzesUseCase } from '@application/quiz/use-cases/get-all-quizzes.use-case';
import { GetQuizByIdUseCase } from '@application/quiz/use-cases/get-quiz-by-id.use-case';
import { RemoveQuestionFromQuizUseCase } from '@application/quiz/use-cases/remove-question-from-quiz.use-case';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  CurrentUser,
  JwtPayload,
} from '@presentation/web/shared/decorators/current-user.decorator';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { Role } from '@shared/types/role.enum';

@Controller({
  path: 'instructor/quizzes',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.INSTRUCTOR)
export class InstructorQuizController {
  constructor(
    private readonly createOrUpdateQuizUseCase: CreateOrUpdateQuizUseCase,
    private readonly addQuestionToQuizUseCase: AddQuestionToQuizUseCase,
    private readonly removeQuestionFromQuizUseCase: RemoveQuestionFromQuizUseCase,
    private readonly getAllQuizzesUseCase: GetAllQuizzesUseCase,
    private readonly getQuizByIdUseCase: GetQuizByIdUseCase,
  ) {}

  @Get()
  async getAllQuizzes(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    const pageDto = await this.getAllQuizzesUseCase.execute(pageOptionsDto);

    return {
      data: pageDto.data.map((quiz) => ({
        id: quiz.id.value,
        instructorId: quiz.instructorId.value,
        lessonId: quiz.lessonId.value,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        questions: quiz.questions.map((question) => ({
          questionId: question.questionId.value,
          points: question.points,
          orderIndex: question.orderIndex,
        })),
      })),
      pagination: pageDto.pagination,
    };
  }

  @Get(':quizId')
  async getQuizById(@Param('quizId') quizId: string) {
    const quiz = await this.getQuizByIdUseCase.execute({ quizId });

    return {
      id: quiz.id.value,
      instructorId: quiz.instructorId.value,
      lessonId: quiz.lessonId.value,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      maxAttempts: quiz.maxAttempts,
      questions: quiz.questions.map((question) => ({
        questionId: question.questionId.value,
        points: question.points,
        orderIndex: question.orderIndex,
      })),
    };
  }

  @Put()
  async createOrUpdateQuiz(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrUpdateQuizDto,
  ) {
    const quiz = await this.createOrUpdateQuizUseCase.execute({
      ...dto,
      instructorId: user.sub,
      description: dto.description ?? '',
    });
    return quiz;
  }

  @Post('questions/add')
  async addQuestion(
    @CurrentUser() user: JwtPayload,
    @Body() dto: AddQuestionToQuizDto,
  ) {
    const quiz = await this.addQuestionToQuizUseCase.execute({
      ...dto,
      instructorId: user.sub,
      orderIndex: dto.orderIndex ?? 0,
    });
    return quiz;
  }

  @Post('questions/remove')
  async removeQuestion(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RemoveQuestionFromQuizDto,
  ) {
    const quiz = await this.removeQuestionFromQuizUseCase.execute({
      ...dto,
      instructorId: user.sub,
    });
    return quiz;
  }
}
