import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { OrderStatus } from '@shared/types/order-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';

export interface OrderProps {
  studentId: UniqueId;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
  createdAt: Date;
}

export class Order extends AggregateRoot<OrderProps> {
  get studentId(): UniqueId { return this.props.studentId; }
  get totalAmount(): number { return this.props.totalAmount; }
  get status(): OrderStatus { return this.props.status; }
  get paymentMethod(): PaymentMethod | undefined { return this.props.paymentMethod; }
  get paidAt(): Date | undefined { return this.props.paidAt; }
  get createdAt(): Date { return this.props.createdAt; }

  markAsSuccess(): void {
    this.props.status = OrderStatus.SUCCESS;
    this.props.paidAt = this.props.paidAt ?? new Date();
  }

  markAsFailed(): void {
    if (this.props.status === OrderStatus.SUCCESS) {
      throw new Error('Cannot fail an already successful order');
    }
    this.props.status = OrderStatus.FAILED;
  }

  markAsPendingPayment(method: PaymentMethod): void {
    if (this.props.status === OrderStatus.SUCCESS) {
      throw new Error('Cannot set pending payment for a successful order');
    }
    this.props.status = OrderStatus.PENDING;
    this.props.paymentMethod = method;
  }

  markAsPaid(): void {
    if (this.props.status === OrderStatus.SUCCESS) {
      return;
    }
    this.props.status = OrderStatus.SUCCESS;
    this.props.paidAt = new Date();
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
