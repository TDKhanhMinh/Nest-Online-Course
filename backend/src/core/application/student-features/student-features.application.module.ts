import { Module } from '@nestjs/common';
import { AddToWishlistUseCase } from './use-cases/add-to-wishlist.use-case';
import { GetWishlistUseCase } from './use-cases/get-wishlist.use-case';
import { RemoveFromWishlistUseCase } from './use-cases/remove-from-wishlist.use-case';

const useCases = [
  AddToWishlistUseCase,
  GetWishlistUseCase,
  RemoveFromWishlistUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class StudentFeaturesApplicationModule {}
