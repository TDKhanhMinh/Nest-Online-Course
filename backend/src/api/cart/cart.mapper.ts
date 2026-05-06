import { Injectable } from '@nestjs/common';
import { Cart } from '@/api/cart/entities/cart.entity';
import { CartDocument } from '@/database/schemas/cart.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class CartMapper {
  toDomain(doc: CartDocument): Cart {
    return Cart.reconstitute(
      {
        studentId: new UniqueId(doc.studentId),
        courseIds: doc.courseIds.map(id => new UniqueId(id)),
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: Cart): any {
    return {
      _id: domain.id.value,
      studentId: domain.studentId.value,
      courseIds: domain.courseIds.map(id => id.value),
    };
  }
}
