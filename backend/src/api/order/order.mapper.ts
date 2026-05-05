import { Injectable } from '@nestjs/common';
import { Order } from '@/api/order/entities/order.entity';
import { OrderDocument } from '@/database/schemas/order.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class OrderMapper {
  toDomain(doc: OrderDocument): Order {
    return Order.create(
      {
        studentId: new UniqueId(doc.studentId),
        totalAmount: doc.totalAmount,
        status: doc.status,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: Order): any {
    return {
      _id: domain.id.value as any,
      studentId: domain.studentId.value,
      totalAmount: domain.totalAmount,
      status: domain.status,
    };
  }
}
