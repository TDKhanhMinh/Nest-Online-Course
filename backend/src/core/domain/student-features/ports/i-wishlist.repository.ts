import { Wishlist } from '@domain/student-features/entities/wishlist.entity';

export const IWISHLIST_REPOSITORY = Symbol('IWishlistRepository');

export interface IWishlistRepository {
  findByUserId(userId: string): Promise<Wishlist[]>;
  findOne(userId: string, courseId: string): Promise<Wishlist | null>;
  save(wishlist: Wishlist): Promise<void>;
  delete(userId: string, courseId: string): Promise<void>;
}



