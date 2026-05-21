import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { QuestionOption } from '../value-objects/question-option.vo';
import { QuestionType } from '@shared/types/question-type.enum';
import { DifficultyLevel } from '@shared/types/difficulty-level.enum';

export interface QuestionProps {
  instructorId: UniqueId;
  courseId?: UniqueId;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: QuestionOption[];
  tags: string[];
}

export class Question extends AggregateRoot<QuestionProps> {
  get instructorId(): UniqueId {
    return this.props.instructorId;
  }

  get courseId(): UniqueId | undefined {
    return this.props.courseId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get type(): QuestionType {
    return this.props.type;
  }

  get difficulty(): DifficultyLevel {
    return this.props.difficulty;
  }

  get options(): QuestionOption[] {
    return [...this.props.options];
  }

  get tags(): string[] {
    return [...this.props.tags];
  }

  public addOption(option: QuestionOption): void {
    if (this.props.type === QuestionType.TRUE_FALSE && this.props.options.length >= 2) {
      throw new Error('True/False questions can only have 2 options');
    }
    this.props.options.push(option);
    this.validateOptions();
  }

  public removeOption(optionId: UniqueId): void {
    this.props.options = this.props.options.filter((opt) => !opt.id.equals(optionId));
    this.validateOptions();
  }

  public markOptionAsCorrect(optionId: UniqueId): void {
    if (this.props.type === QuestionType.SINGLE_CHOICE || this.props.type === QuestionType.TRUE_FALSE) {
      // Unmark all other options
      this.props.options = this.props.options.map((opt) =>
        QuestionOption.reconstitute({
          id: opt.id,
          content: opt.content,
          explanation: opt.explanation,
          isCorrect: opt.id.equals(optionId),
        })
      );
    } else {
      // MULTIPLE_CHOICE: just mark this one as correct
      this.props.options = this.props.options.map((opt) =>
        opt.id.equals(optionId)
          ? QuestionOption.reconstitute({
              id: opt.id,
              content: opt.content,
              explanation: opt.explanation,
              isCorrect: true,
            })
          : opt
      );
    }
  }

  private validateOptions(): void {
    const correctOptions = this.props.options.filter((opt) => opt.isCorrect);
    
    // We only enforce maximums here, minimums should be enforced before saving if needed.
    if (this.props.type === QuestionType.SINGLE_CHOICE && correctOptions.length > 1) {
      throw new Error('Single choice questions can only have 1 correct option');
    }
    
    if (this.props.type === QuestionType.TRUE_FALSE && correctOptions.length > 1) {
      throw new Error('True/False questions can only have 1 correct option');
    }
  }

  public static create(
    props: Omit<QuestionProps, 'options'> & { options?: QuestionOption[] },
    id?: UniqueId
  ): Question {
    const question = new Question(
      {
        ...props,
        options: props.options ?? [],
        tags: props.tags ?? [],
      },
      id ?? UniqueId.generate()
    );
    question.validateOptions();
    return question;
  }

  public static reconstitute(props: QuestionProps, id: UniqueId | string): Question {
    const uniqueId = typeof id === 'string' ? new UniqueId(id) : id;
    return new Question(props, uniqueId);
  }
}
