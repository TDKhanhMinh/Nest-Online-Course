import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

export interface ReviewProps {
  studentId: UniqueId;
  courseId: UniqueId;
  rating: number;
  comment?: string;
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
  get comment(): string | undefined {
    return this.props.comment;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Omit<ReviewProps, 'createdAt' | 'rating'> & { createdAt?: Date; rating?: number },
    id?: UniqueId,
  ): Review {
    const rating = props.rating ?? 5;
    if (rating < 1 || rating > 5) {
      throw new DomainException(
        ErrorCode.VALIDATION_ERROR,
        'Rating must be between 1 and 5',
      );
    }
    return new Review(
      {
        ...props,
        rating,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: ReviewProps, id: UniqueId): Review {
    return new Review(props, id);
  }
}



