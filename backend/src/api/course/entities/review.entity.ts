import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

export interface ReviewProps {
  studentId: UniqueId;
  courseId: UniqueId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export class Review extends Entity<ReviewProps> {
  get studentId(): UniqueId {
    return this.props.studentId;
  }
  get courseId(): UniqueId {
    return this.props.courseId;
  }
  get rating(): number {
    return this.props.rating;
  }
  get comment(): string {
    return this.props.comment;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Omit<ReviewProps, 'createdAt'> & { createdAt?: Date },
    id?: UniqueId,
  ): Review {
    if (props.rating < 1 || props.rating > 5) {
      throw new DomainException(
        ErrorCode.VALIDATION_ERROR,
        'Rating must be between 1 and 5',
      );
    }
    return new Review(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: ReviewProps, id: string): Review {
    return new Review(props, new UniqueId(id));
  }
}
