import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository, ICART_REPOSITORY } from '@/common/abstractions/repositories/i-cart.repository';
import { ICourseRepository, COURSE_REPOSITORY } from '@/common/abstractions/repositories/i-course.repository';
import { Cart } from './entities/cart.entity';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class CartService {
  constructor(
    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async getCart(studentId: string): Promise<Cart> {
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

  async addItem(studentId: string, courseId: string): Promise<Cart> {
    const cart = await this.getCart(studentId);
    const courseUid = new UniqueId(courseId);
    
    const course = await this.courseRepo.findById(courseUid);
    if (!course) {
      throw new NotFoundException(`Course ${courseId} not found`);
    }

    cart.addCourse(courseUid);
    await this.cartRepo.save(cart);
    return cart;
  }

  async removeItem(studentId: string, courseId: string): Promise<Cart> {
    const cart = await this.getCart(studentId);
    const courseUid = new UniqueId(courseId);
    
    cart.removeCourse(courseUid);
    await this.cartRepo.save(cart);
    return cart;
  }

  async clearCart(studentId: string): Promise<void> {
    const cart = await this.getCart(studentId);
    cart.clear();
    await this.cartRepo.save(cart);
  }
}
