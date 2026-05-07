import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface LessonProgressProps {
  enrollmentId: UniqueId;
  lessonId: UniqueId;
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt?: Date;
}

export class LessonProgress extends Entity<LessonProgressProps> {
  get enrollmentId(): UniqueId {
    return this.props.enrollmentId;
  }

  get lessonId(): UniqueId {
    return this.props.lessonId;
  }

  get isCompleted(): boolean {
    return this.props.isCompleted;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get lastAccessedAt(): Date | undefined {
    return this.props.lastAccessedAt;
  }

  public complete(): void {
    this.props.isCompleted = true;
    this.props.completedAt = new Date();
    this.props.lastAccessedAt = new Date();
  }

  public updateLastAccessed(): void {
    this.props.lastAccessedAt = new Date();
  }

  public static create(props: Omit<LessonProgressProps, 'isCompleted' | 'completedAt' | 'lastAccessedAt'>): LessonProgress {
    return new LessonProgress(
      {
        ...props,
        isCompleted: false,
        lastAccessedAt: new Date(),
      },
      UniqueId.generate(),
    );
  }

  public static reconstitute(props: LessonProgressProps, id: UniqueId): LessonProgress {
    return new LessonProgress(props, id);
  }
}



