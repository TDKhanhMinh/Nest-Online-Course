import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface CartProps {
  studentId: UniqueId;
  courseIds: UniqueId[];
}

export class Cart extends AggregateRoot<CartProps> {
  get studentId(): UniqueId { return this.props.studentId; }
  get courseIds(): UniqueId[] { return this.props.courseIds; }

  addCourse(courseId: UniqueId): void {
    const exists = this.props.courseIds.some(id => id.equals(courseId));
    if (!exists) {
      this.props.courseIds.push(courseId);
    }
  }

  removeCourse(courseId: UniqueId): void {
    this.props.courseIds = this.props.courseIds.filter(id => !id.equals(courseId));
  }

  clear(): void {
    this.props.courseIds = [];
  }

  static create(props: CartProps, id?: UniqueId): Cart {
    return new Cart(props, id ?? UniqueId.generate());
  }

  static reconstitute(props: CartProps, id: UniqueId): Cart {
    return new Cart(props, id);
  }
}



