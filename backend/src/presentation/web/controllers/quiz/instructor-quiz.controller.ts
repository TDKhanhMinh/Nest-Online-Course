import { AddQuestionToQuizDto } from '@application/quiz/dto/add-question-to-quiz.dto';
import { CreateQuizDto } from '@application/quiz/dto/create-quiz.dto';
import { RemoveQuestionFromQuizDto } from '@application/quiz/dto/remove-question-from-quiz.dto';
import { UpdateQuizDto } from '@application/quiz/dto/update-quiz.dto';
import { UpdateQuizLessonIdDto } from '@application/quiz/dto/update-quiz-lesson-id.dto';
import { AddQuestionToQuizUseCase } from '@application/quiz/use-cases/add-question-to-quiz.use-case';
import { CreateQuizUseCase } from '@application/quiz/use-cases/create-quiz.use-case';
import { GetAllQuizzesUseCase } from '@application/quiz/use-cases/get-all-quizzes.use-case';
import { GetQuizByIdUseCase } from '@application/quiz/use-cases/get-quiz-by-id.use-case';
import { RemoveQuestionFromQuizUseCase } from '@application/quiz/use-cases/remove-question-from-quiz.use-case';
import { UpdateQuizUseCase } from '@application/quiz/use-cases/update-quiz.use-case';
import { UpdateQuizLessonIdUseCase } from '@application/quiz/use-cases/update-quiz-lesson-id.use-case';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { Quiz } from '@domain/quiz/entities/quiz.entity';

@Controller({
  path: 'instructor/quizzes',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.INSTRUCTOR)
export class InstructorQuizController {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly updateQuizUseCase: UpdateQuizUseCase,
    private readonly addQuestionToQuizUseCase: AddQuestionToQuizUseCase,
    private readonly removeQuestionFromQuizUseCase: RemoveQuestionFromQuizUseCase,
    private readonly getAllQuizzesUseCase: GetAllQuizzesUseCase,
    private readonly getQuizByIdUseCase: GetQuizByIdUseCase,
    private readonly updateQuizLessonIdUseCase: UpdateQuizLessonIdUseCase,
  ) {}

  private toQuizResponse(quiz: Quiz) {
    return {
      id: quiz.id.value,
      instructorId: quiz.instructorId.value,
      lessonId: quiz.lessonId?.value ?? null,
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

  @Get()
  async getAllQuizzes(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    const pageDto = await this.getAllQuizzesUseCase.execute(pageOptionsDto);

    return {
      data: pageDto.data.map((quiz) => this.toQuizResponse(quiz)),
      pagination: pageDto.pagination,
    };
  }

  @Get(':quizId')
  async getQuizById(@Param('quizId') quizId: string) {
    const quiz = await this.getQuizByIdUseCase.execute({ quizId });

    return this.toQuizResponse(quiz);
  }

  @Post()
  async createQuiz(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateQuizDto,
  ) {
    const quiz = await this.createQuizUseCase.execute({
      ...dto,
      instructorId: user.sub,
      description: dto.description ?? '',
    });
    return this.toQuizResponse(quiz);
  }

  @Put(':quizId')
  async updateQuiz(
    @Param('quizId') quizId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateQuizDto,
  ) {
    const quiz = await this.updateQuizUseCase.execute({
      quizId,
      instructorId: user.sub,
      ...dto,
      description: dto.description ?? '',
    });

    return this.toQuizResponse(quiz);
  }

  @Patch(':quizId/lesson')
  async updateQuizLessonId(
    @Param('quizId') quizId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateQuizLessonIdDto,
  ) {
    const quiz = await this.updateQuizLessonIdUseCase.execute({
      quizId,
      lessonId: dto.lessonId,
      instructorId: user.sub,
    });

    return this.toQuizResponse(quiz);
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
    return this.toQuizResponse(quiz);
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
