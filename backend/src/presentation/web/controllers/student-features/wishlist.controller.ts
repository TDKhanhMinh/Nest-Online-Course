import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { AddToWishlistUseCase } from '@application/student-features/use-cases/add-to-wishlist.use-case';
import { GetWishlistUseCase } from '@application/student-features/use-cases/get-wishlist.use-case';
import { RemoveFromWishlistUseCase } from '@application/student-features/use-cases/remove-from-wishlist.use-case';
import { AddToWishlistDto } from '@application/student-features/dto/wishlist.dto';

@Controller({
  path: 'wishlist',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(
    private readonly addToWishlistUseCase: AddToWishlistUseCase,
    private readonly getWishlistUseCase: GetWishlistUseCase,
    private readonly removeFromWishlistUseCase: RemoveFromWishlistUseCase,
  ) {}

  @Get()
  async getWishlist(@CurrentUser() user: JwtPayload) {
    return this.getWishlistUseCase.execute(user.sub);
  }

  @Post()
  async add(@CurrentUser() user: JwtPayload, @Body() dto: AddToWishlistDto) {
    await this.addToWishlistUseCase.execute(user.sub, dto);
    return { success: true };
  }

  @Delete(':courseId')
  async remove(@CurrentUser() user: JwtPayload, @Param('courseId') courseId: string) {
    await this.removeFromWishlistUseCase.execute(user.sub, courseId);
    return { success: true };
  }
}
