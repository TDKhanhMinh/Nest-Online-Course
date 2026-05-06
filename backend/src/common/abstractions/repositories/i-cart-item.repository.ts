import { CartItem } from '@/api/student-features/entities/cart-item.entity';

export const ICART_ITEM_REPOSITORY = 'ICART_ITEM_REPOSITORY';

export interface ICartItemRepository {
  findByUserId(userId: string): Promise<CartItem[]>;
  findOne(userId: string, courseId: string): Promise<CartItem | null>;
  save(cartItem: CartItem): Promise<void>;
  delete(userId: string, courseId: string): Promise<void>;
  clear(userId: string): Promise<void>;
}
