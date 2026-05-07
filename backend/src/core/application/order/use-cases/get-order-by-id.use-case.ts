import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository, IORDER_REPOSITORY } from '@domain/order/ports/i-order.repository';
import { Order } from '@domain/order/entities/order.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepo.findById(new UniqueId(orderId));
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
