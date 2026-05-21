import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../domain/quiz/ports/i-quiz.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
export interface CreateOrUpdateQuizCommand {
  instructorId: string;
  lessonId?: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
}

@Injectable()
export class CreateOrUpdateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}
  async execute(command: CreateOrUpdateQuizCommand): Promise<Quiz> {
    const lessonId = command.lessonId
      ? new UniqueId(command.lessonId)
      : new UniqueId(new Types.ObjectId().toString());

    const instructorId = new UniqueId(command.instructorId);

    let quiz = await this.quizRepository.findByLessonId(lessonId);

    if (quiz) {
      if (!quiz.instructorId.equals(instructorId)) {
        throw new ForbiddenException(
          'You do not have permission to modify this quiz',
        );
      }

      quiz = Quiz.reconstitute(
        {
          instructorId: quiz.instructorId,
          lessonId: lessonId,
          title: command.title,
          description: command.description,
          passingScore: command.passingScore,
          timeLimit: command.timeLimit,
          maxAttempts: command.maxAttempts,
          questions: quiz.questions,
        },
        quiz.id,
      );
    } else {
      quiz = Quiz.create({
        instructorId: instructorId,
        lessonId: lessonId,
        title: command.title,
        description: command.description,
        passingScore: command.passingScore,
        timeLimit: command.timeLimit,
        maxAttempts: command.maxAttempts,
        questions: [],
      });
    }

    await this.quizRepository.save(quiz);
    return quiz;
  }
}
