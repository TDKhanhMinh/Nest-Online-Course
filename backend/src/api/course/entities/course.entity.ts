import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseTitle } from '@/api/course/value-objects/course-title.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';
import { Lesson } from '@/api/course/entities/lesson.entity';
import { LessonCompletedEvent } from '@/api/course/events/lesson-completed.event';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

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
    if (!lesson) throw new DomainException(ErrorCode.COURSE_NOT_FOUND, `Lesson ${lessonId.value} not found in course`);
    if (lesson.isCompleted) throw new DomainException(ErrorCode.LESSON_ALREADY_COMPLETED, `Lesson ${lessonId.value} already completed`);

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
