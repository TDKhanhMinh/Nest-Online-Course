import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AddToCartDto } from '@application/cart/dto/cart.dto';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { GetCartUseCase } from '@application/cart/use-cases/get-cart.use-case';
import { AddItemToCartUseCase } from '@application/cart/use-cases/add-item-to-cart.use-case';
import { RemoveItemFromCartUseCase } from '@application/cart/use-cases/remove-item-from-cart.use-case';
import { ClearCartUseCase } from '@application/cart/use-cases/clear-cart.use-case';

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
  ) {}

  @Get()
  async getCart(@CurrentUser() user: JwtPayload) {
    const cart = await this.getCartUseCase.execute(user.sub);
    return {
      studentId: cart.studentId.value,
      courseIds: cart.courseIds.map(id => id.value),
    };
  }

  @Post('items')
  async addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddToCartDto) {
    const cart = await this.addItemToCartUseCase.execute(user.sub, dto.courseId);
    return {
      studentId: cart.studentId.value,
      courseIds: cart.courseIds.map(id => id.value),
    };
  }

  @Delete('items/:courseId')
  async removeItem(@CurrentUser() user: JwtPayload, @Param('courseId') courseId: string) {
    const cart = await this.removeItemFromCartUseCase.execute(user.sub, courseId);
    return {
      studentId: cart.studentId.value,
      courseIds: cart.courseIds.map(id => id.value),
    };
  }

  @Delete()
  async clearCart(@CurrentUser() user: JwtPayload) {
    await this.clearCartUseCase.execute(user.sub);
    return { message: 'Cart cleared' };
  }
}
