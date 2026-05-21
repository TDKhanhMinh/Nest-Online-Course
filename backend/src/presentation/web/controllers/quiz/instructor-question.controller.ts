import { CreateQuestionDto } from '@application/quiz/dto/create-question.dto';
import { UpdateQuestionDto } from '@application/quiz/dto/update-question.dto';
import { CreateQuestionUseCase } from '@application/quiz/use-cases/create-question.use-case';
import { DeleteQuestionUseCase } from '@application/quiz/use-cases/delete-question.use-case';
import { GetInstructorQuestionsUseCase } from '@application/quiz/use-cases/get-instructor-questions.use-case';
import { UpdateQuestionUseCase } from '@application/quiz/use-cases/update-question.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { Role } from '@shared/types/role.enum';

@Controller({
  path: 'instructor/questions',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.INSTRUCTOR)
export class InstructorQuestionController {
  constructor(
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    private readonly deleteQuestionUseCase: DeleteQuestionUseCase,
    private readonly getInstructorQuestionsUseCase: GetInstructorQuestionsUseCase,
  ) {}

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateQuestionDto) {
    const question = await this.createQuestionUseCase.execute({
      ...dto,
      instructorId: user.sub,
    });
    return question;
  }

  @Get()
  async getQuestions(
    @CurrentUser() user: JwtPayload,
    @Query(new ValidationPipe({ transform: true })) pageOptionsDto: PageOptionsDto,
    @Query('courseId') courseId?: string,
  ) {
    const pageDto = await this.getInstructorQuestionsUseCase.execute({
      instructorId: user.sub,
      pageOptionsDto,
      courseId,
    });
    return {
      data: pageDto.data,
      pagination: pageDto.pagination,
    };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    const question = await this.updateQuestionUseCase.execute({
      ...dto,
      questionId: id,
      instructorId: user.sub,
    });
    return question;
  }

  @Delete(':id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.deleteQuestionUseCase.execute({
      questionId: id,
      instructorId: user.sub,
    });
    return { success: true, message: 'Question deleted successfully' };
  }
}

