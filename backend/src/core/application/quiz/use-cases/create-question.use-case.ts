import { Inject, Injectable } from '@nestjs/common';
import { Question } from '../../../domain/quiz/entities/question.entity';
import { IQuestionRepository, QUESTION_REPOSITORY } from '../../../domain/quiz/ports/i-question.repository';
import { QuestionOption } from '../../../domain/quiz/value-objects/question-option.vo';
import { DifficultyLevel } from '../../../shared/types/difficulty-level.enum';
import { QuestionType } from '../../../shared/types/question-type.enum';
import { UniqueId } from '../../../shared/types/unique-id.vo';

export interface CreateQuestionCommand {
  instructorId: string;
  courseId?: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: {
    content: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  tags?: string[];
}

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository
  ) {}

  async execute(command: CreateQuestionCommand): Promise<Question> {
    const options = command.options.map((opt) =>
      QuestionOption.create({
        content: opt.content,
        isCorrect: opt.isCorrect,
        explanation: opt.explanation,
      })
    );

    const question = Question.create({
      instructorId: new UniqueId(command.instructorId),
      courseId: command.courseId ? new UniqueId(command.courseId) : undefined,
      title: command.title,
      content: command.content,
      type: command.type,
      difficulty: command.difficulty,
      options,
      tags: command.tags || [],
    });

    await this.questionRepository.save(question);
    return question;
  }
}
