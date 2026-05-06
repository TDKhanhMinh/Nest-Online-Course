import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';

@Controller({
  path: 'orders',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(user.sub, user.email, dto);
  }

  @Post('checkout')
  async checkout(@CurrentUser() user: JwtPayload) {
    return this.orderService.checkout(user.sub, user.email);
  }

  @Get()
  async getMyOrders(@CurrentUser() user: JwtPayload) {
    return this.orderService.getStudentOrders(user.sub);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }
}
