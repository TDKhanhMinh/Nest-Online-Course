import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export interface LessonProgressProps {
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export class LessonProgress extends Entity<LessonProgressProps> {
  get enrollmentId(): string {
    return this.props.enrollmentId;
  }

  get lessonId(): string {
    return this.props.lessonId;
  }

  get isCompleted(): boolean {
    return this.props.isCompleted;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public complete(): void {
    this.props.isCompleted = true;
    this.props.completedAt = new Date();
  }

  public static create(props: Omit<LessonProgressProps, 'isCompleted' | 'completedAt'>): LessonProgress {
    return new LessonProgress(
      {
        ...props,
        isCompleted: false,
      },
      UniqueId.generate(),
    );
  }

  public static reconstitute(props: LessonProgressProps, id: string): LessonProgress {
    return new LessonProgress(props, new UniqueId(id));
  }
}
