import { Module } from '@nestjs/common';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { CheckoutCartUseCase } from './use-cases/checkout-cart.use-case';
import { GetStudentOrdersUseCase } from './use-cases/get-student-orders.use-case';
import { GetOrderByIdUseCase } from './use-cases/get-order-by-id.use-case';

const useCases = [
  CreateOrderUseCase,
  CheckoutCartUseCase,
  GetStudentOrdersUseCase,
  GetOrderByIdUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class OrderApplicationModule {}
