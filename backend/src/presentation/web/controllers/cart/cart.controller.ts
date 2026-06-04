import { Controller, Get, Post, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { AddToCartDto } from '@application/cart/dto/cart.dto';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { GetCartUseCase } from '@application/cart/use-cases/get-cart.use-case';
import { AddItemToCartUseCase } from '@application/cart/use-cases/add-item-to-cart.use-case';
import { RemoveItemFromCartUseCase } from '@application/cart/use-cases/remove-item-from-cart.use-case';
import { ClearCartUseCase } from '@application/cart/use-cases/clear-cart.use-case';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ICategoryRepository, ICATEGORY_REPOSITORY } from '@domain/course/ports/i-category.repository';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { Cart } from '@domain/cart/entities/cart.entity';

interface CartItemSummary {
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  price: number;
  instructorName: string;
  categoryName: string;
}

interface CartResponse {
  studentId: string;
  items: CartItemSummary[];
  totalItems: number;
  totalAmount: number;
}

@Controller({
  path: 'cart',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  private async enrichCart(cart: Cart): Promise<CartResponse> {
    const items: CartItemSummary[] = [];
    let totalAmount = 0;

    for (const courseId of cart.courseIds) {
      const course = await this.courseRepo.findById(courseId);
      if (!course) continue;

      const [instructor, category] = await Promise.all([
        this.userRepo.findById(course.instructorId),
        this.categoryRepo.findById(course.categoryId),
      ]);

      const price = course.price;
      totalAmount += price;

      items.push({
        courseId: courseId.value,
        title: course.title.value,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        price,
        instructorName: instructor?.fullName || 'Unknown Instructor',
        categoryName: category?.name || 'Uncategorized',
      });
    }

    return {
      studentId: cart.studentId.value,
      items,
      totalItems: items.length,
      totalAmount,
    };
  }

  @Get()
  async getCart(@CurrentUser() user: JwtPayload) {
    const cart = await this.getCartUseCase.execute(user.sub);
    return this.enrichCart(cart);
  }

  @Post('items')
  async addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddToCartDto) {
    const cart = await this.addItemToCartUseCase.execute(user.sub, dto.courseId);
    return this.enrichCart(cart);
  }

  @Delete('items/:courseId')
  async removeItem(@CurrentUser() user: JwtPayload, @Param('courseId') courseId: string) {
    const cart = await this.removeItemFromCartUseCase.execute(user.sub, courseId);
    return this.enrichCart(cart);
  }

  @Delete()
  async clearCart(@CurrentUser() user: JwtPayload) {
    await this.clearCartUseCase.execute(user.sub);
    return { message: 'Cart cleared' };
  }
}
