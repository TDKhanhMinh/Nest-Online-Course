import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { Role } from '@shared/types/role.enum';
import { AddQuestionToQuizDto } from '@application/quiz/dto/add-question-to-quiz.dto';
import { CreateOrUpdateQuizDto } from '@application/quiz/dto/create-or-update-quiz.dto';
import { RemoveQuestionFromQuizDto } from '@application/quiz/dto/remove-question-from-quiz.dto';
import { AddQuestionToQuizUseCase } from '@application/quiz/use-cases/add-question-to-quiz.use-case';
import { CreateOrUpdateQuizUseCase } from '@application/quiz/use-cases/create-or-update-quiz.use-case';
import { RemoveQuestionFromQuizUseCase } from '@application/quiz/use-cases/remove-question-from-quiz.use-case';

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
  ) {}

  @Put()
  async createOrUpdateQuiz(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrUpdateQuizDto,
  ) {
    const quiz = await this.createOrUpdateQuizUseCase.execute({
      ...dto
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

