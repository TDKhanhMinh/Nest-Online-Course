import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IQuizRepository, QUIZ_REPOSITORY } from '../../../domain/quiz/ports/i-quiz.repository';
import { Quiz } from '../../../domain/quiz/entities/quiz.entity';
import { UniqueId } from '../../../shared/types/unique-id.vo';
// Assuming we have some IQuestionRepository to fetch questions if needed, 
// but returning the Quiz entity is often enough for the controller to then fetch questions.
// For student get-quiz, maybe we just return the Quiz config.

export interface GetQuizByLessonCommand {
  lessonId: string;
}

@Injectable()
export class GetQuizByLessonUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(command: GetQuizByLessonCommand): Promise<Quiz> {
    const lessonId = new UniqueId(command.lessonId);
    const quiz = await this.quizRepository.findByLessonId(lessonId);
    
    if (!quiz) {
      throw new NotFoundException('Quiz not found for this lesson');
    }

    return quiz;
  }
}
