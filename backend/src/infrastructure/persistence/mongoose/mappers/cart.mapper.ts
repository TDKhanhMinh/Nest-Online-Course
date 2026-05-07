import { Injectable } from '@nestjs/common';
import { Cart } from '@domain/cart/entities/cart.entity';
import { CartDocument } from '@/database/schemas/cart.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class CartMapper {
  static toDomain(doc: CartDocument): Cart {
    return Cart.reconstitute(
      {
        studentId: new UniqueId(doc.studentId.toString()),
        courseIds: doc.courseIds.map(id => new UniqueId(id.toString())),
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Cart): any {
    return {
      _id: domain.id.value,
      studentId: domain.studentId.value,
      courseIds: domain.courseIds.map(id => id.value),
    };
  }
}
