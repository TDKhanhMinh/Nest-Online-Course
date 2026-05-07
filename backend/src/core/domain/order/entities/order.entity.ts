import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

import { OrderStatus } from '@shared/types/order-status.enum';

export interface OrderProps {
  studentId: UniqueId;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

export class Order extends AggregateRoot<OrderProps> {
  get studentId(): UniqueId { return this.props.studentId; }
  get totalAmount(): number { return this.props.totalAmount; }
  get status(): OrderStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }

  markAsSuccess(): void {
    this.props.status = OrderStatus.SUCCESS;
  }

  markAsFailed(): void {
    this.props.status = OrderStatus.FAILED;
  }

  static create(props: Omit<OrderProps, 'createdAt'> & { createdAt?: Date }, id?: UniqueId): Order {
    return new Order({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id ?? UniqueId.generate());
  }

  public static reconstitute(props: OrderProps, id: UniqueId): Order {
    return new Order(props, id);
  }
}



