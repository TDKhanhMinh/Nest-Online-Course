import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository, IORDER_REPOSITORY } from '@domain/order/ports/i-order.repository';
import { Order } from '@domain/order/entities/order.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetStudentOrdersUseCase {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(studentId: string): Promise<Order[]> {
    return this.orderRepo.findByStudentId(new UniqueId(studentId));
  }
}
