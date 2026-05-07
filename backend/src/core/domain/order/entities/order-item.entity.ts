import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface OrderItemProps {
  orderId: UniqueId;
  courseId: UniqueId;
  courseTitle: string;
  courseThumbnail?: string;
  price: number;
}

export class OrderItem extends Entity<OrderItemProps> {
  get orderId(): UniqueId { return this.props.orderId; }
  get courseId(): UniqueId { return this.props.courseId; }
  get courseTitle(): string { return this.props.courseTitle; }
  get courseThumbnail(): string | undefined { return this.props.courseThumbnail; }
  get price(): number { return this.props.price; }

  static create(props: OrderItemProps, id?: UniqueId): OrderItem {
    return new OrderItem(props, id ?? UniqueId.generate());
  }

  public static reconstitute(props: OrderItemProps, id: UniqueId): OrderItem {
    return new OrderItem(props, id);
  }
}



