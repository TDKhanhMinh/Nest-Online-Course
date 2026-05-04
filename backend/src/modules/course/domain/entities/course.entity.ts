import { AggregateRoot } from '@/infrastructure/shared-kernel/aggregate-root.base';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { CourseTitle } from '../value-objects/course-title.vo';
import { QuizScore } from '../value-objects/quiz-score.vo';
import { Lesson } from './lesson.entity';
import { LessonCompletedEvent } from '../events/lesson-completed.event';
import { CourseNotFoundException } from '../exceptions/course-not-found.exception';
import { LessonAlreadyCompletedException } from '../exceptions/lesson-already-completed.exception';

export interface CourseProps {
  title: CourseTitle;
  instructorId: UniqueId;
  description: string;
  lessons: Lesson[];
  minPassScore: QuizScore;
  isPublished: boolean;
}

export class Course extends AggregateRoot<CourseProps> {
  get title(): CourseTitle     { return this.props.title; }
  get description(): string    { return this.props.description; }
  get lessons(): Lesson[]      { return this.props.lessons; }
  get minPassScore(): QuizScore { return this.props.minPassScore; }
  get isPublished(): boolean   { return this.props.isPublished; }
  get instructorId(): UniqueId { return this.props.instructorId; }

  /**
   * Invariant 1: Lesson phải tồn tại trong course.
   * Invariant 2: Lesson chưa được completed.
   * Invariant 3: Score hợp lệ (enforced by QuizScore VO).
   */
  completeLesson(lessonId: UniqueId, studentId: UniqueId, score: QuizScore): void {
    const lesson = this.props.lessons.find((l) => l.id.equals(lessonId));
    if (!lesson) throw new CourseNotFoundException(lessonId.value);
    if (lesson.isCompleted) throw new LessonAlreadyCompletedException(lessonId.value);

    lesson.markCompleted(score);

    this.addDomainEvent(
      new LessonCompletedEvent({
        courseId: this.id,
        lessonId,
        studentId,
        score,
        occurredAt: new Date(),
      }),
    );
  }

  /** Invariant: tất cả lessons completed VÀ mỗi score >= minPassScore */
  isEligibleForCertificate(): boolean {
    return (
      this.props.lessons.length > 0 &&
      this.props.lessons.every(
        (l) => l.isCompleted && l.lastScore.isGreaterOrEqual(this.props.minPassScore),
      )
    );
  }

  allLessonsCompleted(): boolean {
    return this.props.lessons.length > 0 && this.props.lessons.every((l) => l.isCompleted);
  }

  static create(props: CourseProps, id?: UniqueId): Course {
    return new Course(props, id ?? UniqueId.generate());
  }

  static reconstitute(props: CourseProps, id: UniqueId): Course {
    return new Course(props, id);
  }
}
