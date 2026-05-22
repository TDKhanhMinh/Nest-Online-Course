import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from '../../../domain/quiz/ports/i-question.repository';
import { Question } from '../../../domain/quiz/entities/question.entity';
import { UniqueId } from '../../../shared/types/unique-id.vo';
import { PageOptionsDto } from '../../../shared/pagination/offset/page-options.dto';
import { PageDto } from '../../../shared/pagination/offset/page.dto';

export interface GetInstructorQuestionsCommand {
  instructorId: string;
  pageOptionsDto: PageOptionsDto;
  courseId?: string;
}

@Injectable()
export class GetInstructorQuestionsUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(
    command: GetInstructorQuestionsCommand,
  ): Promise<PageDto<Question>> {
    return this.questionRepository.findInstructorQuestions(
      new UniqueId(command.instructorId),
      command.pageOptionsDto,
      command.courseId ? new UniqueId(command.courseId) : undefined,
    );
  }
}
