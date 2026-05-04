import { Entity } from '@/infrastructure/shared-kernel/aggregate-root.base';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { QuizScore } from '../value-objects/quiz-score.vo';

export interface LessonProps {
  title: string;
  videoAssetId: string;
  order: number;
  isCompleted: boolean;
  lastScore: QuizScore;
}

export class Lesson extends Entity<LessonProps> {
  get title(): string         { return this.props.title; }
  get videoAssetId(): string  { return this.props.videoAssetId; }
  get order(): number         { return this.props.order; }
  get isCompleted(): boolean  { return this.props.isCompleted; }
  get lastScore(): QuizScore  { return this.props.lastScore; }

  markCompleted(score: QuizScore): void {
    this.props.isCompleted = true;
    this.props.lastScore = score;
  }

  static create(props: Omit<LessonProps, 'isCompleted' | 'lastScore'>, id?: UniqueId): Lesson {
    return new Lesson(
      { ...props, isCompleted: false, lastScore: new QuizScore(0) },
      id ?? UniqueId.generate(),
    );
  }

  static reconstitute(props: LessonProps, id: UniqueId): Lesson {
    return new Lesson(props, id);
  }
}
