import { Inject, Injectable } from '@nestjs/common';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { GetCartUseCase } from './get-cart.use-case';

@Injectable()
export class ClearCartUseCase {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
  ) {}

  async execute(studentId: string): Promise<void> {
    const cart = await this.getCartUseCase.execute(studentId);
    cart.clear();
    await this.cartRepo.save(cart);
  }
}
