import { DomainEvent } from '@/infrastructure/shared-kernel/domain-event.base';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { QuizScore } from '../value-objects/quiz-score.vo';

export interface LessonCompletedEventProps {
  courseId: UniqueId;
  lessonId: UniqueId;
  studentId: UniqueId;
  score: QuizScore;
  occurredAt: Date;
}

export class LessonCompletedEvent extends DomainEvent {
  readonly courseId: UniqueId;
  readonly lessonId: UniqueId;
  readonly studentId: UniqueId;
  readonly score: QuizScore;

  constructor(props: LessonCompletedEventProps) {
    super(props.occurredAt);
    this.courseId  = props.courseId;
    this.lessonId  = props.lessonId;
    this.studentId = props.studentId;
    this.score     = props.score;
  }
}
