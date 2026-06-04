import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository, IORDER_REPOSITORY } from '@domain/order/ports/i-order.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface OrderItemDto {
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  price: number;
}

export interface StudentOrderDto {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: OrderItemDto[];
}

@Injectable()
export class GetStudentOrdersUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(studentId: string): Promise<StudentOrderDto[]> {
    const orders = await this.orderRepo.findByStudentId(new UniqueId(studentId));

    const results: StudentOrderDto[] = [];

    for (const order of orders) {
      const items = await this.orderRepo.findItemsByOrderId(order.id);

      results.push({
        id: order.id.value,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: items.map(item => ({
          courseId: item.courseId.value,
          courseTitle: item.courseTitle,
          courseThumbnail: item.courseThumbnail,
          price: item.price,
        })),
      });
    }

    return results;
  }
}
