import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export enum OrderStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

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
