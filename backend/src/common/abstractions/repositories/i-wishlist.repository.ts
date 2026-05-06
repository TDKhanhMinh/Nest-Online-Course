import { Wishlist } from '@/api/student-features/entities/wishlist.entity';

export const IWISHLIST_REPOSITORY = 'IWISHLIST_REPOSITORY';

export interface IWishlistRepository {
  findByUserId(userId: string): Promise<Wishlist[]>;
  findOne(userId: string, courseId: string): Promise<Wishlist | null>;
  save(wishlist: Wishlist): Promise<void>;
  delete(userId: string, courseId: string): Promise<void>;
}
