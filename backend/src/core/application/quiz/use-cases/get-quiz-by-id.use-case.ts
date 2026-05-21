import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../domain/quiz/ports/i-quiz.repository';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface GetQuizByIdCommand {
  quizId: string;
}

@Injectable()
export class GetQuizByIdUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(command: GetQuizByIdCommand): Promise<Quiz> {
    const quiz = await this.quizRepository.findById(new UniqueId(command.quizId));

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }
}
