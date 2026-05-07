import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IOrderRepository, IORDER_REPOSITORY } from '@domain/order/ports/i-order.repository';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { Order } from '@domain/order/entities/order.entity';
import { OrderStatus } from '@shared/types/order-status.enum';
import { OrderItem } from '@domain/order/entities/order-item.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CreateOrderDto } from '../dto/order.dto';

import { OrderSuccessEvent } from '../events/order-success.event';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(studentId: string, studentEmail: string, dto: CreateOrderDto): Promise<Order> {
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

      orderItems.push(OrderItem.create({
        orderId,
        courseId: course.id,
        courseTitle: course.title.value,
        courseThumbnail: course.thumbnailUrl,
        price,
      }));
    }

    const order = Order.create({
      studentId: new UniqueId(studentId),
      totalAmount,
      status: OrderStatus.PENDING,
    }, orderId);

    // Simulate payment success immediately for this version
    order.markAsSuccess();

    await this.orderRepo.save(order, orderItems);

    // Emit event for automatic enrollment
    this.eventEmitter.emit(
      'order.success',
      new OrderSuccessEvent(
        order.id.value,
        studentId,
        orderItems.map(item => item.courseId.value),
        studentEmail,
      ),
    );

    return order;
  }
}
