import { Inject, Injectable } from '@nestjs/common';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { Cart } from '@domain/cart/entities/cart.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { GetCartUseCase } from './get-cart.use-case';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
  ) {}

  async execute(studentId: string, courseId: string): Promise<Cart> {
    const cart = await this.getCartUseCase.execute(studentId);
    const courseUid = new UniqueId(courseId);
    
    cart.removeCourse(courseUid);
    await this.cartRepo.save(cart);
    return cart;
  }
}
