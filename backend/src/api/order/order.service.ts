import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '@/common/abstractions/repositories/i-order.repository';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/repositories/i-course.repository';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/order.dto';
import { UniqueId } from '@/common/types/unique-id.vo';
import { CartService } from '@/api/cart/cart.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderSuccessEvent } from './events/order-success.event';

@Injectable()
export class OrderService {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepo: IOrderRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    private readonly cartService: CartService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async createOrder(studentId: string, studentEmail: string, dto: CreateOrderDto): Promise<Order> {
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

  async checkout(studentId: string, studentEmail: string): Promise<Order> {
    const cart = await this.cartService.getCart(studentId);
    if (cart.courseIds.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const dto: CreateOrderDto = {
      courseIds: cart.courseIds.map(id => id.value),
    };

    const order = await this.createOrder(studentId, studentEmail, dto);

    // Clear cart after successful order creation
    await this.cartService.clearCart(studentId);

    return order;
  }

  async getStudentOrders(studentId: string): Promise<Order[]> {
    return this.orderRepo.findByStudentId(studentId);
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
