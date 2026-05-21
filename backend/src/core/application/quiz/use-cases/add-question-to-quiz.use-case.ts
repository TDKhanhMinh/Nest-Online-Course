import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IQuizRepository, QUIZ_REPOSITORY } from '../../../domain/quiz/ports/i-quiz.repository';
import { IQuestionRepository, QUESTION_REPOSITORY } from '../../../domain/quiz/ports/i-question.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';

export interface AddQuestionToQuizCommand {
  instructorId: string;
  quizId: string;
  questionId: string;
  points: number;
  orderIndex: number;
}

@Injectable()
export class AddQuestionToQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository
  ) {}

  async execute(command: AddQuestionToQuizCommand): Promise<Quiz> {
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

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    quiz.addQuestion(questionId, command.points, command.orderIndex);
    await this.quizRepository.save(quiz);
    
    return quiz;
  }
}
