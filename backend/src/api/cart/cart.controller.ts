import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/cart.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';

@Controller({
  path: 'cart',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: JwtPayload) {
    const cart = await this.cartService.getCart(user.sub);
    return {
      studentId: cart.studentId.value,
      courseIds: cart.courseIds.map(id => id.value),
    };
  }

  @Post('items')
  async addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddToCartDto) {
    const cart = await this.cartService.addItem(user.sub, dto.courseId);
    return {
      studentId: cart.studentId.value,
      courseIds: cart.courseIds.map(id => id.value),
    };
  }

  @Delete('items/:courseId')
  async removeItem(@CurrentUser() user: JwtPayload, @Param('courseId') courseId: string) {
    const cart = await this.cartService.removeItem(user.sub, courseId);
    return {
      studentId: cart.studentId.value,
      courseIds: cart.courseIds.map(id => id.value),
    };
  }

  @Delete()
  async clearCart(@CurrentUser() user: JwtPayload) {
    await this.cartService.clearCart(user.sub);
    return { message: 'Cart cleared' };
  }
}
