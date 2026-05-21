import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../domain/quiz/ports/i-quiz.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface CreateQuizCommand {
  instructorId: string;
  lessonId?: string | null;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
}

@Injectable()
export class CreateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(command: CreateQuizCommand): Promise<Quiz> {
    const lessonId = command.lessonId ? new UniqueId(command.lessonId) : null;

    if (lessonId) {
      const existingQuiz = await this.quizRepository.findByLessonId(lessonId);
      if (existingQuiz) {
        throw new ConflictException('A quiz already exists for this lesson');
      }
    }

    const quiz = Quiz.create({
      instructorId: new UniqueId(command.instructorId),
      lessonId,
      title: command.title,
      description: command.description,
      passingScore: command.passingScore,
      timeLimit: command.timeLimit,
      maxAttempts: command.maxAttempts,
      questions: [],
    });

    await this.quizRepository.save(quiz);
    return quiz;
  }
}
