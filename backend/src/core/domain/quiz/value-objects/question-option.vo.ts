import { UniqueId } from '@shared/types/unique-id.vo';
import { ValueObject } from '@shared/abstractions/value-object.base';

interface QuestionOptionProps {
  id: UniqueId;
  content: string;
  isCorrect: boolean;
  explanation?: string;
}

export class QuestionOption extends ValueObject<QuestionOptionProps> {
  get id(): UniqueId {
    return this.props.id;
  }

  get content(): string {
    return this.props.content;
  }

  get isCorrect(): boolean {
    return this.props.isCorrect;
  }

  get explanation(): string | undefined {
    return this.props.explanation;
  }

  private constructor(props: QuestionOptionProps) {
    super(props);
  }

  public static create(props: {
    content: string;
    isCorrect: boolean;
    explanation?: string;
  }): QuestionOption {
    if (!props.content || props.content.trim().length === 0) {
      throw new Error('Option content cannot be empty');
    }
    
    return new QuestionOption({
      id: UniqueId.generate(),
      content: props.content.trim(),
      isCorrect: props.isCorrect,
      explanation: props.explanation?.trim(),
    });
  }

  public static reconstitute(props: {
    id: UniqueId;
    content: string;
    isCorrect: boolean;
    explanation?: string;
  }): QuestionOption {
    return new QuestionOption(props);
  }
}
