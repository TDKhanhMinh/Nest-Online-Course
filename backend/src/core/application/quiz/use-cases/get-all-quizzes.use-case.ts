import { Inject, Injectable } from '@nestjs/common';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../domain/quiz/ports/i-quiz.repository';
import { PageOptionsDto } from '../../../shared/pagination/offset/page-options.dto';
import { PageDto } from '../../../shared/pagination/offset/page.dto';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';

@Injectable()
export class GetAllQuizzesUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(pageOptionsDto: PageOptionsDto): Promise<PageDto<Quiz>> {
    return this.quizRepository.findAll(pageOptionsDto);
  }
}
