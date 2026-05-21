import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../domain/quiz/ports/i-quiz.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface UpdateQuizCommand {
  quizId: string;
  instructorId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
}

@Injectable()
export class UpdateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(command: UpdateQuizCommand): Promise<Quiz> {
    const quiz = await this.quizRepository.findById(new UniqueId(command.quizId));

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const instructorId = new UniqueId(command.instructorId);
    if (!quiz.instructorId.equals(instructorId)) {
      throw new ForbiddenException(
        'You do not have permission to modify this quiz',
      );
    }

    const updatedQuiz = Quiz.reconstitute(
      {
        instructorId: quiz.instructorId,
        lessonId: quiz.lessonId,
        title: command.title,
        description: command.description,
        passingScore: command.passingScore,
        timeLimit: command.timeLimit,
        maxAttempts: command.maxAttempts,
        questions: quiz.questions,
      },
      quiz.id,
    );

    await this.quizRepository.save(updatedQuiz);
    return updatedQuiz;
  }
}
