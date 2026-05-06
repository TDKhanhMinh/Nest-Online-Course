import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseTitle } from '@/api/course/value-objects/course-title.vo';
import { QuizScore } from '@/api/course/value-objects/quiz-score.vo';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface CourseProps {
  title: CourseTitle;
  subtitle?: string;
  instructorId: UniqueId;
  description: string;
  priceTier: number;
  status: CourseStatus;
  minPassScore: QuizScore;
  isPublished: boolean;
}

export class Course extends AggregateRoot<CourseProps> {
  get title(): CourseTitle {
    return this.props.title;
  }
  get subtitle(): string | undefined {
    return this.props.subtitle;
  }
  get description(): string {
    return this.props.description;
  }
  get instructorId(): UniqueId {
    return this.props.instructorId;
  }
  get priceTier(): number {
    return this.props.priceTier;
  }
  get status(): CourseStatus {
    return this.props.status;
  }
  get minPassScore(): QuizScore {
    return this.props.minPassScore;
  }
  get isPublished(): boolean {
    return this.props.isPublished;
  }

  isEligibleForCertificate(): boolean {
    return false;
  }

  updateStatus(status: CourseStatus): void {
    this.props.status = status;
    this.props.isPublished = status === CourseStatus.PUBLISHED;
  }

  static create(props: CourseProps, id?: UniqueId): Course {
    return new Course(props, id ?? UniqueId.generate());
  }

  static reconstitute(props: CourseProps, id: UniqueId): Course {
    return new Course(props, id);
  }
}
