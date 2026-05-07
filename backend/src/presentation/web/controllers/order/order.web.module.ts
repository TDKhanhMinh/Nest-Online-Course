import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderApplicationModule } from '@application/order/order.application.module';

@Module({
  imports: [OrderApplicationModule],
  controllers: [OrderController],
})
export class OrderWebModule {}
