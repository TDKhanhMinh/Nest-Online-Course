import { Cart } from '@/api/cart/entities/cart.entity';
import { UniqueId } from '@/common/types/unique-id.vo';

export const ICART_REPOSITORY = Symbol('ICartRepository');

export interface ICartRepository {
  findByStudentId(studentId: UniqueId): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
}
