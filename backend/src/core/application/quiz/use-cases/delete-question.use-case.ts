import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IQuestionRepository, QUESTION_REPOSITORY } from '../../../domain/quiz/ports/i-question.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface DeleteQuestionCommand {
  instructorId: string;
  questionId: string;
}

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository
  ) {}

  async execute(command: DeleteQuestionCommand): Promise<void> {
    const questionId = new UniqueId(command.questionId);
    const instructorId = new UniqueId(command.instructorId);

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (!question.instructorId.equals(instructorId)) {
      throw new ForbiddenException('You do not have permission to delete this question');
    }

    await this.questionRepository.delete(questionId);
  }
}
