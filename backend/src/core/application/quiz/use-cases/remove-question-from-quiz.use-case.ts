import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IQuizRepository, QUIZ_REPOSITORY } from '../../../domain/quiz/ports/i-quiz.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface RemoveQuestionFromQuizCommand {
  instructorId: string;
  quizId: string;
  questionId: string;
}

@Injectable()
export class RemoveQuestionFromQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(command: RemoveQuestionFromQuizCommand): Promise<void> {
    const quizId = new UniqueId(command.quizId);
    const questionId = new UniqueId(command.questionId);
    const instructorId = new UniqueId(command.instructorId);

    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (!quiz.instructorId.equals(instructorId)) {
      throw new ForbiddenException('You do not have permission to modify this quiz');
    }

    quiz.removeQuestion(questionId);
    await this.quizRepository.save(quiz);
  }
}
