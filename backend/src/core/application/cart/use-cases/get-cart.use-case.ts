import { Inject, Injectable } from '@nestjs/common';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { Cart } from '@domain/cart/entities/cart.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
  ) {}

  async execute(studentId: string): Promise<Cart> {
    const studentUid = new UniqueId(studentId);
    let cart = await this.cartRepo.findByStudentId(studentUid);
    
    if (!cart) {
      cart = Cart.create({
        studentId: studentUid,
        courseIds: [],
      });
      await this.cartRepo.save(cart);
    }
    
    return cart;
  }
}
