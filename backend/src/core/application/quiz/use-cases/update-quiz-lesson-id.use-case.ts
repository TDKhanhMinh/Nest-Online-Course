import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../../../domain/quiz/ports/i-quiz.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface UpdateQuizLessonIdCommand {
  quizId: string;
  lessonId: string | null;
  instructorId: string;
}

@Injectable()
export class UpdateQuizLessonIdUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(command: UpdateQuizLessonIdCommand): Promise<Quiz> {
    const quizId = new UniqueId(command.quizId);
    const lessonId = command.lessonId ? new UniqueId(command.lessonId) : null;
    const instructorId = new UniqueId(command.instructorId);

    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (!quiz.instructorId.equals(instructorId)) {
      throw new ForbiddenException(
        'You do not have permission to modify this quiz',
      );
    }

    if (lessonId) {
      const existingQuiz = await this.quizRepository.findByLessonId(lessonId);
      if (existingQuiz && !existingQuiz.id.equals(quiz.id)) {
        throw new ConflictException('A quiz already exists for this lesson');
      }
    }

    const updatedQuiz = Quiz.reconstitute(
      {
        instructorId: quiz.instructorId,
        lessonId,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        questions: quiz.questions,
      },
      quiz.id,
    );

    await this.quizRepository.save(updatedQuiz);
    return updatedQuiz;
  }
}
