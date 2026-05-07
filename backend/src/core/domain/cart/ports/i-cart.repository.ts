import { Cart } from '@domain/cart/entities/cart.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ICART_REPOSITORY = Symbol('ICartRepository');

export interface ICartRepository {
  findByStudentId(studentId: UniqueId): Promise<Cart | null>;
  save(cart: Cart): Promise<void>;
}



