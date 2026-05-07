import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from '@application/order/dto/order.dto';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { CheckoutCartUseCase } from '@application/order/use-cases/checkout-cart.use-case';
import { GetStudentOrdersUseCase } from '@application/order/use-cases/get-student-orders.use-case';
import { GetOrderByIdUseCase } from '@application/order/use-cases/get-order-by-id.use-case';

@Controller({
  path: 'orders',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly checkoutCartUseCase: CheckoutCartUseCase,
    private readonly getStudentOrdersUseCase: GetStudentOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(user.sub, user.email, dto);
  }

  @Post('checkout')
  async checkout(@CurrentUser() user: JwtPayload) {
    return this.checkoutCartUseCase.execute(user.sub, user.email);
  }

  @Get()
  async getMyOrders(@CurrentUser() user: JwtPayload) {
    return this.getStudentOrdersUseCase.execute(user.sub);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.getOrderByIdUseCase.execute(id);
  }
}
