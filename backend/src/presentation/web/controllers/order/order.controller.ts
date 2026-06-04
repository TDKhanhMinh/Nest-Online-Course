import { CreateOrderDto } from '@application/order/dto/order.dto';
import { CheckoutCartUseCase } from '@application/order/use-cases/checkout-cart.use-case';
import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { GetOrderByIdUseCase } from '@application/order/use-cases/get-order-by-id.use-case';
import { GetStudentOrdersUseCase } from '@application/order/use-cases/get-student-orders.use-case';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';

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
    const order = await this.createOrderUseCase.execute(user.sub, user.email, dto);
    return {
      id: order.id.value,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    };
  }

  @Post('checkout')
  async checkout(@CurrentUser() user: JwtPayload) {
    const order = await this.checkoutCartUseCase.execute(user.sub, user.email);
    return {
      id: order.id.value,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    };
  }

  @Get()
  async getMyOrders(@CurrentUser() user: JwtPayload) {
    return this.getStudentOrdersUseCase.execute(user.sub);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.getOrderByIdUseCase.execute(id);
    return {
      id: order.id.value,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    };
  }
}
