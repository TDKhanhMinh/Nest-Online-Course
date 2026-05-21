import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface QuizQuestionConfig {
  questionId: UniqueId;
  points: number;
  orderIndex: number;
}

export interface QuizProps {
  instructorId: UniqueId;
  lessonId: UniqueId | null;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number; // In minutes, 0 means no limit
  maxAttempts: number; // 0 means unlimited
  questions: QuizQuestionConfig[];
}

export class Quiz extends AggregateRoot<QuizProps> {
  get instructorId(): UniqueId {
    return this.props.instructorId;
  }

  get lessonId(): UniqueId | null {
    return this.props.lessonId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get passingScore(): number {
    return this.props.passingScore;
  }

  get timeLimit(): number {
    return this.props.timeLimit;
  }

  get maxAttempts(): number {
    return this.props.maxAttempts;
  }

  get questions(): QuizQuestionConfig[] {
    return [...this.props.questions];
  }

  public addQuestion(questionId: UniqueId, points: number, orderIndex: number): void {
    if (this.props.questions.some((q) => q.questionId.equals(questionId))) {
      throw new Error('Question already exists in this quiz');
    }

    this.props.questions.push({ questionId, points, orderIndex });
    this.props.questions.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public removeQuestion(questionId: UniqueId): void {
    this.props.questions = this.props.questions.filter((q) => !q.questionId.equals(questionId));
  }

  public updatePassingScore(score: number): void {
    if (score < 0) {
      throw new Error('Passing score cannot be negative');
    }
    this.props.passingScore = score;
  }

  public static create(
    props: Omit<QuizProps, 'questions'> & { questions?: QuizQuestionConfig[] },
    id?: UniqueId
  ): Quiz {
    return new Quiz(
      {
        ...props,
        questions: props.questions ?? [],
      },
      id ?? UniqueId.generate()
    );
  }

  public static reconstitute(props: QuizProps, id: UniqueId | string): Quiz {
    const uniqueId = typeof id === 'string' ? new UniqueId(id) : id;
    return new Quiz(props, uniqueId);
  }
}
