import { Order } from '@/api/order/entities/order.entity';
import { OrderItem } from '@/api/order/entities/order-item.entity';

export const IOrderRepository = Symbol('IOrderRepository');

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByStudentId(studentId: string): Promise<Order[]>;
  save(order: Order, items: OrderItem[]): Promise<void>;
}
