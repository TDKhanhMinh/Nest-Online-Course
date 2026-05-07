import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartApplicationModule } from '@application/cart/cart.application.module';

@Module({
  imports: [CartApplicationModule],
  controllers: [CartController],
})
export class CartWebModule {}
