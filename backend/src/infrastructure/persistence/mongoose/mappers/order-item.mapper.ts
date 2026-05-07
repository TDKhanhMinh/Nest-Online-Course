import { OrderItem } from '@domain/order/entities/order-item.entity';
import { OrderItemDocument } from '@/database/schemas/order-item.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class OrderItemMapper {
  static toDomain(doc: OrderItemDocument): OrderItem {
    return OrderItem.reconstitute(
      {
        orderId: new UniqueId(doc.orderId.toString()),
        courseId: new UniqueId(doc.courseId.toString()),
        courseTitle: doc.courseTitle,
        courseThumbnail: doc.courseThumbnail,
        price: doc.price,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: OrderItem): any {
    return {
      _id: domain.id.value,
      orderId: domain.orderId.value,
      courseId: domain.courseId.value,
      courseTitle: domain.courseTitle,
      courseThumbnail: domain.courseThumbnail,
      price: domain.price,
    };
  }
}
