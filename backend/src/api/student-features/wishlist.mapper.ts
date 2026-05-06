import { Injectable } from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistDocument } from '@/database/schemas/wishlist.schema';

@Injectable()
export class WishlistMapper {
  public toDomain(doc: WishlistDocument): Wishlist {
    return Wishlist.reconstitute(
      {
        userId: doc.userId.toString(),
        courseId: doc.courseId.toString(),
      },
      (doc._id as any).toString(),
    );
  }

  public toPersistence(domain: Wishlist): any {
    return {
      _id: domain.id.value,
      userId: domain.userId,
      courseId: domain.courseId,
    };
  }
}
