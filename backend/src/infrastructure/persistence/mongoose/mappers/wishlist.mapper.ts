import { Injectable } from '@nestjs/common';
import { Wishlist } from '@domain/student-features/entities/wishlist.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { WishlistDocument } from '@/database/schemas/wishlist.schema';

export class WishlistMapper {
  static toDomain(doc: WishlistDocument): Wishlist {
    return Wishlist.reconstitute(
      {
        userId: doc.userId.toString(),
        courseId: doc.courseId.toString(),
      },
      (doc._id as any).toString(),
    );
  }

  static toPersistence(domain: Wishlist): any {
    return {
      _id: domain.id.value,
      userId: domain.userId,
      courseId: domain.courseId,
    };
  }
}



