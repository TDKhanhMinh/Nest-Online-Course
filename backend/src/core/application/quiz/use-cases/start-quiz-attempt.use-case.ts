import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IQuizRepository, QUIZ_REPOSITORY } from '../../../domain/quiz/ports/i-quiz.repository';
import { IQuizAttemptRepository, QUIZ_ATTEMPT_REPOSITORY } from '../../../domain/quiz/ports/i-quiz-attempt.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';
import { QuizAttempt } from '../../../domain/quiz/entities/quiz-attempt.entity';

export interface StartQuizAttemptCommand {
  studentId: string;
  quizId: string;
}

@Injectable()
export class StartQuizAttemptUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository
  ) {}

  async execute(command: StartQuizAttemptCommand): Promise<QuizAttempt> {
    const quizId = new UniqueId(command.quizId);
    const studentId = new UniqueId(command.studentId);

    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.maxAttempts > 0) {
      const attemptsCount = await this.attemptRepository.countAttempts(studentId, quizId);
      if (attemptsCount >= quiz.maxAttempts) {
        throw new BadRequestException('You have reached the maximum number of attempts for this quiz');
      }
    }

    const attempt = QuizAttempt.create({
      studentId,
      quizId,
      startTime: new Date(),
    });

    await this.attemptRepository.save(attempt);
    return attempt;
  }
}
