import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '@/common/abstractions/repositories/i-order.repository';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/repositories/i-course.repository';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/order.dto';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class OrderService {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepo: IOrderRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) { }

  async createOrder(studentId: string, dto: CreateOrderDto): Promise<Order> {
    let totalAmount = 0;
    const orderId = UniqueId.generate();
    const orderItems: OrderItem[] = [];

    for (const courseId of dto.courseIds) {
      const course = await this.courseRepo.findById(new UniqueId(courseId));
      if (!course) {
        throw new NotFoundException(`Course ${courseId} not found`);
      }

      // In a real system, price might come from a PriceTier or current discount
      // const price = course.props.priceTier === 'FREE' ? 0 : 9.99; // Placeholder logic
      const price = 9.99;  // Placeholder logic
      totalAmount += price;

      orderItems.push(OrderItem.create({
        orderId,
        courseId: course.id,
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

    // TODO: In Phase 4, trigger enrollment event here

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
