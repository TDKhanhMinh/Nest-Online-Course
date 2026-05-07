import { Injectable } from '@nestjs/common';
import { CartItem } from '@domain/student-features/entities/cart-item.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CartItemDocument } from '@/database/schemas/cart-item.schema';

export class CartItemMapper {
  static toDomain(doc: CartItemDocument): CartItem {
    return CartItem.reconstitute(
      {
        userId: doc.userId.toString(),
        courseId: doc.courseId.toString(),
      },
      (doc._id as any).toString(),
    );
  }

  static toPersistence(domain: CartItem): any {
    return {
      _id: domain.id.value,
      userId: domain.userId,
      courseId: domain.courseId,
    };
  }
}



