import { Order } from '@domain/order/entities/order.entity';
import { OrderItem } from '@domain/order/entities/order-item.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const IORDER_REPOSITORY = Symbol('IOrderRepository');

export interface IOrderRepository {
  findById(id: UniqueId): Promise<Order | null>;
  findByStudentId(studentId: UniqueId): Promise<Order[]>;
  save(order: Order, items: OrderItem[]): Promise<void>;
}



