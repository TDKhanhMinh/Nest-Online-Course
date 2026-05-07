import { Module } from '@nestjs/common';
import { GetCartUseCase } from './use-cases/get-cart.use-case';
import { AddItemToCartUseCase } from './use-cases/add-item-to-cart.use-case';
import { RemoveItemFromCartUseCase } from './use-cases/remove-item-from-cart.use-case';
import { ClearCartUseCase } from './use-cases/clear-cart.use-case';

const useCases = [
  GetCartUseCase,
  AddItemToCartUseCase,
  RemoveItemFromCartUseCase,
  ClearCartUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class CartApplicationModule {}
