import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface StudentAnswer {
  questionId: UniqueId;
  selectedOptionIds: UniqueId[];
}

export interface QuizAttemptProps {
  studentId: UniqueId;
  quizId: UniqueId;
  startTime: Date;
  endTime?: Date;
  score: number;
  isPassed: boolean;
  answers: StudentAnswer[];
}

export class QuizAttempt extends AggregateRoot<QuizAttemptProps> {
  get studentId(): UniqueId {
    return this.props.studentId;
  }

  get quizId(): UniqueId {
    return this.props.quizId;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date | undefined {
    return this.props.endTime;
  }

  get score(): number {
    return this.props.score;
  }

  get isPassed(): boolean {
    return this.props.isPassed;
  }

  get answers(): StudentAnswer[] {
    return [...this.props.answers];
  }

  public recordAnswer(questionId: UniqueId, selectedOptionIds: UniqueId[]): void {
    if (this.isCompleted()) {
      throw new Error('Cannot modify answers for a completed attempt');
    }

    const existingIndex = this.props.answers.findIndex((a) => a.questionId.equals(questionId));
    if (existingIndex >= 0) {
      this.props.answers[existingIndex].selectedOptionIds = [...selectedOptionIds];
    } else {
      this.props.answers.push({ questionId, selectedOptionIds: [...selectedOptionIds] });
    }
  }

  public submit(calculatedScore: number, isPassed: boolean): void {
    if (this.isCompleted()) {
      throw new Error('Quiz attempt is already completed');
    }

    this.props.endTime = new Date();
    this.props.score = calculatedScore;
    this.props.isPassed = isPassed;
  }

  public isCompleted(): boolean {
    return this.props.endTime !== undefined;
  }

  public static create(
    props: Omit<QuizAttemptProps, 'answers' | 'score' | 'isPassed'>,
    id?: UniqueId
  ): QuizAttempt {
    return new QuizAttempt(
      {
        ...props,
        score: 0,
        isPassed: false,
        answers: [],
      },
      id ?? UniqueId.generate()
    );
  }

  public static reconstitute(props: QuizAttemptProps, id: UniqueId | string): QuizAttempt {
    const uniqueId = typeof id === 'string' ? new UniqueId(id) : id;
    return new QuizAttempt(props, uniqueId);
  }
}
