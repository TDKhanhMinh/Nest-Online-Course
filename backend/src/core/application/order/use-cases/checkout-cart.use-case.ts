import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CreateOrderUseCase } from './create-order.use-case';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { IEnrollmentRepository, IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { Order } from '@domain/order/entities/order.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class CheckoutCartUseCase {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
    @Inject(IENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
  ) {}

  async execute(studentId: string, studentEmail: string): Promise<Order> {
    const studentUid = new UniqueId(studentId);
    const cart = await this.cartRepo.findByStudentId(studentUid);
    
    if (!cart || cart.courseIds.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Filter out courses already enrolled
    const validCourseIds: string[] = [];
    for (const courseId of cart.courseIds) {
      const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentUid, courseId);
      if (!enrollment) {
        validCourseIds.push(courseId.value);
      }
    }

    if (validCourseIds.length === 0) {
      throw new BadRequestException('All courses in your cart are already purchased');
    }

    const dto = {
      courseIds: validCourseIds,
    };

    const order = await this.createOrderUseCase.execute(studentId, studentEmail, dto);

    // Clear cart after successful order creation
    cart.clear();
    await this.cartRepo.save(cart);

    return order;
  }
}
