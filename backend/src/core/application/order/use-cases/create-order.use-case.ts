import {
  ICOURSE_REPOSITORY,
  ICourseRepository,
} from '@domain/course/ports/i-course.repository';
import { OrderItem } from '@domain/order/entities/order-item.entity';
import { Order } from '@domain/order/entities/order.entity';
import { Transaction } from '@domain/order/entities/transaction.entity';
import {
  IORDER_REPOSITORY,
  IOrderRepository,
} from '@domain/order/ports/i-order.repository';
import {
  ITRANSACTION_REPOSITORY,
  ITransactionRepository,
} from '@domain/order/ports/i-transaction.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatus } from '@shared/types/order-status.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CreateOrderDto } from '../dto/order.dto';
import { OrderSuccessEvent } from '../events/order-success.event';

// Let's import PaymentMethod properly
import { PaymentMethod as DomainPaymentMethod } from '@shared/types/payment-method.enum';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ITRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    studentId: string,
    studentEmail: string,
    dto: CreateOrderDto,
  ): Promise<Order> {
    let totalAmount = 0;
    const orderId = UniqueId.generate();
    const orderItems: OrderItem[] = [];

    for (const courseId of dto.courseIds) {
      const course = await this.courseRepo.findById(new UniqueId(courseId));
      if (!course) {
        throw new NotFoundException(`Course ${courseId} not found`);
      }

      const price = course.price;
      totalAmount += price;

      orderItems.push(
        OrderItem.create({
          orderId,
          courseId: course.id,
          courseTitle: course.title.value,
          courseThumbnail: course.thumbnailUrl,
          price,
        }),
      );
    }

    const order = Order.create(
      {
        studentId: new UniqueId(studentId),
        totalAmount,
        status: OrderStatus.PENDING,
      },
      orderId,
    );

    // If order total is 0, finalize immediately (Free Course Checkout)
    if (totalAmount === 0) {
      order.markAsSuccess();
      order.markAsPendingPayment(DomainPaymentMethod.FREE);
      order.markAsPaid();
      
      await this.orderRepo.save(order, orderItems);

      const transaction = Transaction.create({
        userId: new UniqueId(studentId),
        orderId: order.id,
        courseId: orderItems.length === 1 ? orderItems[0].courseId : undefined,
        paymentMethod: DomainPaymentMethod.FREE,
        amountVnd: 0,
        currency: 'VND',
        amount: 0,
        gatewayTransactionNo: 'FREE_' + order.id.value,
      });
      transaction.markAsSuccess('FREE_' + order.id.value, { note: 'Free checkout' });

      await this.transactionRepo.save(transaction);

      // Emit event for automatic enrollment
      this.eventEmitter.emit(
        'order.success',
        new OrderSuccessEvent(
          order.id.value,
          studentId,
          orderItems.map((item) => item.courseId.value),
          studentEmail,
        ),
      );
    } else {
      // Keep order PENDING, wait for payment gateway callbacks
      await this.orderRepo.save(order, orderItems);
    }

    return order;
  }
}
