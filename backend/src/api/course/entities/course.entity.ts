import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CourseTitle } from '@/api/course/value-objects/course-title.vo';
import { CourseStatus } from '@/common/types/course-status.enum';
import { CourseLevel } from '@/common/types/course-level.enum';

export interface CourseProps {
  title: CourseTitle;
  slug: string;
  instructorId: UniqueId;
  categoryId: UniqueId;
  description: string;
  price: number;
  thumbnailUrl?: string;
  level: CourseLevel;
  language: string;
  status: CourseStatus;
}

export class Course extends AggregateRoot<CourseProps> {
  get title(): CourseTitle {
    return this.props.title;
  }
  get slug(): string {
    return this.props.slug;
  }
  get description(): string {
    return this.props.description;
  }
  get instructorId(): UniqueId {
    return this.props.instructorId;
  }
  get categoryId(): UniqueId {
    return this.props.categoryId;
  }
  get price(): number {
    return this.props.price;
  }
  get thumbnailUrl(): string | undefined {
    return this.props.thumbnailUrl;
  }
  get level(): CourseLevel {
    return this.props.level;
  }
  get language(): string {
    return this.props.language;
  }
  get status(): CourseStatus {
    return this.props.status;
  }

  isEligibleForCertificate(): boolean {
    return false;
  }

  update(props: Partial<Omit<CourseProps, 'instructorId' | 'slug' | 'status'>>): void {
    if (props.title) this.props.title = props.title;
    if (props.description) this.props.description = props.description;
    if (props.price !== undefined) this.props.price = props.price;
    if (props.categoryId) this.props.categoryId = props.categoryId;
    if (props.thumbnailUrl) this.props.thumbnailUrl = props.thumbnailUrl;
    if (props.level) this.props.level = props.level;
    if (props.language) this.props.language = props.language;
  }

  updateStatus(status: CourseStatus): void {
    // Business rule: Cannot publish a course without a thumbnail (example)
    if (status === CourseStatus.PUBLISHED && !this.props.thumbnailUrl) {
      throw new Error('Cannot publish course without a thumbnail');
    }
    this.props.status = status;
  }

  static create(props: CourseProps, id?: UniqueId): Course {
    return new Course(props, id ?? UniqueId.generate());
  }

  static reconstitute(props: CourseProps, id: UniqueId): Course {
    return new Course(props, id);
  }
}
