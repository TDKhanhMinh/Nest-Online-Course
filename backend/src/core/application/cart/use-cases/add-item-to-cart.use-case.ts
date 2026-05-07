import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { Cart } from '@domain/cart/entities/cart.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { GetCartUseCase } from './get-cart.use-case';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(studentId: string, courseId: string): Promise<Cart> {
    const cart = await this.getCartUseCase.execute(studentId);
    const courseUid = new UniqueId(courseId);
    
    const course = await this.courseRepo.findById(courseUid);
    if (!course) {
      throw new NotFoundException(`Course ${courseId} not found`);
    }

    cart.addCourse(courseUid);
    await this.cartRepo.save(cart);
    return cart;
  }
}
