import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { CourseLevel } from '@shared/types/course-level.enum';
import { CourseStatus } from '@shared/types/course-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';

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
  totalEnrolled: number;
  totalReview: number;
  averageRating: number;
  isPublished: boolean;
  totalView: number;
  totalLike: number;
  totalContent: number;
  totalSection: number;
  totalLesson: number;
  totalQuiz: number;
  totalAssignment: number;
  totalLecture: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  get totalEnrolled(): number {
    return this.props.totalEnrolled;
  }
  get totalReview(): number {
    return this.props.totalReview;
  }
  get averageRating(): number {
    return this.props.averageRating;
  }
  get isPublished(): boolean {
    return this.props.isPublished;
  }
  get totalView(): number {
    return this.props.totalView;
  }
  get totalLike(): number {
    return this.props.totalLike;
  }
  get totalContent(): number {
    return this.props.totalContent;
  }
  get totalSection(): number {
    return this.props.totalSection;
  }
  get totalLesson(): number {
    return this.props.totalLesson;
  }
  get totalQuiz(): number {
    return this.props.totalQuiz;
  }
  get totalAssignment(): number {
    return this.props.totalAssignment;
  }
  get totalLecture(): number {
    return this.props.totalLecture;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  isEligibleForCertificate(): boolean {
    return false;
  }

  update(
    props: Partial<Omit<CourseProps, 'instructorId' | 'slug' | 'status'>>,
  ): void {
    if (props.title) this.props.title = props.title;
    if (props.description) this.props.description = props.description;
    if (props.price !== undefined) this.props.price = props.price;
    if (props.categoryId) this.props.categoryId = props.categoryId;
    if (props.thumbnailUrl) this.props.thumbnailUrl = props.thumbnailUrl;
    if (props.level) this.props.level = props.level;
    if (props.language) this.props.language = props.language;
    if (props.totalSection !== undefined)
      this.props.totalSection = props.totalSection;
    if (props.totalLesson !== undefined)
      this.props.totalLesson = props.totalLesson;
    if (props.updatedAt) this.props.updatedAt = props.updatedAt;
  }

  addSection(): void {
    this.props.totalSection = (this.props.totalSection ?? 0) + 1;
    this.props.updatedAt = new Date();
  }

  removeSection(lessonLength: number): void {
    this.props.totalSection = Math.max(0, (this.props.totalSection ?? 0) - 1);
    this.props.totalLesson = Math.max(
      0,
      (this.props.totalLesson ?? 0) - lessonLength,
    );
    this.props.updatedAt = new Date();
  }

  addLesson(): void {
    this.props.totalLesson = (this.props.totalLesson ?? 0) + 1;
    this.props.updatedAt = new Date();
  }

  removeLesson(): void {
    this.props.totalLesson = Math.max(0, (this.props.totalLesson ?? 0) - 1);
    this.props.updatedAt = new Date();
  }

  touch(): void {
    this.props.updatedAt = new Date();
  }

  updateStatus(status: CourseStatus): void {
    // Business rule: Cannot publish a course without a thumbnail (example)
    if (status === CourseStatus.PUBLISHED && !this.props.thumbnailUrl) {
      throw new Error('Cannot publish course without a thumbnail');
    }
    this.props.status = status;
    this.props.isPublished = status === CourseStatus.PUBLISHED;
    this.props.updatedAt = new Date();
  }

  submitForApproval(): void {
    this.props.status = CourseStatus.PENDING_APPROVAL;
    this.props.isPublished = false;
    this.props.updatedAt = new Date();
  }

  static create(props: CourseProps, id?: UniqueId): Course {
    return new Course(props, id ?? UniqueId.generate());
  }

  static reconstitute(props: CourseProps, id: UniqueId): Course {
    return new Course(props, id);
  }
}
