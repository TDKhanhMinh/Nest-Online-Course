import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export interface OrderItemProps {
  orderId: UniqueId;
  courseId: UniqueId;
  price: number;
}

export class OrderItem extends Entity<OrderItemProps> {
  get orderId(): UniqueId { return this.props.orderId; }
  get courseId(): UniqueId { return this.props.courseId; }
  get price(): number { return this.props.price; }

  static create(props: OrderItemProps, id?: UniqueId): OrderItem {
    return new OrderItem(props, id ?? UniqueId.generate());
  }

  public static reconstitute(props: OrderItemProps, id: string): OrderItem {
    return new OrderItem(props, new UniqueId(id));
  }
}
