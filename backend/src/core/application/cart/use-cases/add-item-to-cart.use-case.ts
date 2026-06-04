import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { IEnrollmentRepository, IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { Cart } from '@domain/cart/entities/cart.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { GetCartUseCase } from './get-cart.use-case';
import { CourseStatus } from '@shared/types/course-status.enum';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(IENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,
  ) {}

  async execute(studentId: string, courseId: string): Promise<Cart> {
    const cart = await this.getCartUseCase.execute(studentId);
    const courseUid = new UniqueId(courseId);
    const studentUid = new UniqueId(studentId);
    
    const course = await this.courseRepo.findById(courseUid);
    if (!course) {
      throw new NotFoundException(`Course ${courseId} not found`);
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new BadRequestException('Course is not available for purchase');
    }

    // Check if already in cart
    const alreadyInCart = cart.courseIds.some(id => id.equals(courseUid));
    if (alreadyInCart) {
      throw new BadRequestException('Course is already in your cart');
    }

    // Check if already enrolled
    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentUid, courseUid);
    if (enrollment) {
      throw new BadRequestException('You already own this course');
    }

    cart.addCourse(courseUid);
    await this.cartRepo.save(cart);
    return cart;
  }
}
