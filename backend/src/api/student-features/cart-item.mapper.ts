import { Injectable } from '@nestjs/common';
import { CartItem } from './entities/cart-item.entity';
import { CartItemDocument } from '@/database/schemas/cart-item.schema';

@Injectable()
export class CartItemMapper {
  public toDomain(doc: CartItemDocument): CartItem {
    return CartItem.reconstitute(
      {
        userId: doc.userId.toString(),
        courseId: doc.courseId.toString(),
      },
      (doc._id as any).toString(),
    );
  }

  public toPersistence(domain: CartItem): any {
    return {
      _id: domain.id.value,
      userId: domain.userId,
      courseId: domain.courseId,
    };
  }
}
