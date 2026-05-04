import { DomainEvent } from '@/common/abstractions/domain-event.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';

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
