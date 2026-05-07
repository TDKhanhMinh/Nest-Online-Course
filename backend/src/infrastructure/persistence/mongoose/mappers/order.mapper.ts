import { OrderStatus } from '@/core/shared/types/order-status.enum';
import { OrderDocument } from '@/database/schemas/order.schema';
import { Order } from '@domain/order/entities/order.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export class OrderMapper {
  static toDomain(doc: OrderDocument): Order {
    return Order.reconstitute(
      {
        studentId: new UniqueId(doc.studentId.toString()),
        totalAmount: doc.totalAmount,
        status: doc.status as OrderStatus,
        createdAt: (doc as any).createdAt,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Order): any {
    return {
      _id: domain.id.value,
      studentId: domain.studentId.value,
      totalAmount: domain.totalAmount,
      status: domain.status as any,
    };
  }
}
