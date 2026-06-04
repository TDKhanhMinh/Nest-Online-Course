import { Injectable } from '@nestjs/common';
import { Order } from '@domain/order/entities/order.entity';
import { OrderDocument } from '@/database/schemas/order.schema';
import { UniqueId } from '@shared/types/unique-id.vo';
import { PaymentMethod } from '@shared/types/payment-method.enum';

@Injectable()
export class OrderMapper {
  toDomain(doc: OrderDocument): Order {
    return Order.reconstitute(
      {
        studentId: new UniqueId(doc.studentId),
        totalAmount: doc.totalAmount,
        status: doc.status,
        paymentMethod: doc.paymentMethod as PaymentMethod | undefined,
        paidAt: doc.paidAt,
        createdAt: doc.createdAt,
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
      paymentMethod: domain.paymentMethod,
      paidAt: domain.paidAt,
    };
  }
}
