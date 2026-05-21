import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IQuestionRepository, QUESTION_REPOSITORY } from '../../../domain/quiz/ports/i-question.repository';
import { Question } from '../../../domain/quiz/entities/question.entity';
import { UniqueId } from '../../../shared/types/unique-id.vo';
import { QuestionType } from '../../../shared/types/question-type.enum';
import { DifficultyLevel } from '../../../shared/types/difficulty-level.enum';
import { QuestionOption } from '../../../domain/quiz/value-objects/question-option.vo';

export interface UpdateQuestionCommand {
  instructorId: string;
  questionId: string;
  title?: string;
  content?: string;
  type?: QuestionType;
  difficulty?: DifficultyLevel;
  options?: {
    content: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  tags?: string[];
}

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository
  ) {}

  async execute(command: UpdateQuestionCommand): Promise<Question> {
    const questionId = new UniqueId(command.questionId);
    const instructorId = new UniqueId(command.instructorId);

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (!question.instructorId.equals(instructorId)) {
      throw new ForbiddenException('You do not have permission to modify this question');
    }

    // Since our entity is simple and we don't have update setters for everything yet,
    // we'll use reconstitute to create a new instance with updated props, but keeping the same ID.
    // In a more complex domain, we should add updateTitle, updateContent etc methods to Question entity.
    
    let options = question.options;
    if (command.options) {
      options = command.options.map((opt) =>
        QuestionOption.create({
          content: opt.content,
          isCorrect: opt.isCorrect,
          explanation: opt.explanation,
        })
      );
    }

    const updatedQuestion = Question.reconstitute({
      instructorId: question.instructorId,
      courseId: question.courseId,
      title: command.title ?? question.title,
      content: command.content ?? question.content,
      type: command.type ?? question.type,
      difficulty: command.difficulty ?? question.difficulty,
      options: options,
      tags: command.tags ?? question.tags,
    }, question.id);

    // Validate the new options by calling a dummy method if needed, but reconstitute bypasses it.
    // Let's create a new one using create to ensure validation runs, but we need to keep ID.
    const validatedQuestion = Question.create({
      instructorId: updatedQuestion.instructorId,
      courseId: updatedQuestion.courseId,
      title: updatedQuestion.title,
      content: updatedQuestion.content,
      type: updatedQuestion.type,
      difficulty: updatedQuestion.difficulty,
      options: updatedQuestion.options,
      tags: updatedQuestion.tags,
    }, updatedQuestion.id);

    await this.questionRepository.save(validatedQuestion);
    return validatedQuestion;
  }
}
