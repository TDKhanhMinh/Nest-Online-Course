import { Injectable } from '@nestjs/common';
import { OrderItem } from '@/api/order/entities/order-item.entity';
import { OrderItemDocument } from '@/database/schemas/order-item.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class OrderItemMapper {
  toDomain(doc: OrderItemDocument): OrderItem {
    return OrderItem.create(
      {
        orderId: new UniqueId(doc.orderId),
        courseId: new UniqueId(doc.courseId),
        price: doc.price,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: OrderItem): any {
    return {
      _id: domain.id.value as any,
      orderId: domain.orderId.value,
      courseId: domain.courseId.value,
      price: domain.price,
    };
  }
}
