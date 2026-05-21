import { DomainEvent } from '../../../shared/abstractions/domain-event.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export class QuizPassedEvent extends DomainEvent {
  public readonly studentId: UniqueId;
  public readonly quizId: UniqueId;
  public readonly score: number;
  public readonly passingScore: number;
  // Can add lessonId if needed, but the listener can fetch the quiz to find out which lesson it was

  constructor(props: {
    studentId: UniqueId;
    quizId: UniqueId;
    score: number;
    passingScore: number;
  }) {
    super();
    this.studentId = props.studentId;
    this.quizId = props.quizId;
    this.score = props.score;
    this.passingScore = props.passingScore;
  }
}
