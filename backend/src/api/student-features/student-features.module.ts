import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistDocument, WishlistSchema } from '@/database/schemas/wishlist.schema';
import { CartItemDocument, CartItemSchema } from '@/database/schemas/cart-item.schema';
import { WishlistRepository } from './wishlist.repository';
import { CartItemRepository } from './cart-item.repository';
import { WishlistMapper } from './wishlist.mapper';
import { CartItemMapper } from './cart-item.mapper';
import { IWISHLIST_REPOSITORY } from '@/common/abstractions/repositories/i-wishlist.repository';
import { ICART_ITEM_REPOSITORY } from '@/common/abstractions/repositories/i-cart-item.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WishlistDocument.name, schema: WishlistSchema },
      { name: CartItemDocument.name, schema: CartItemSchema },
    ]),
  ],
  providers: [
    { provide: IWISHLIST_REPOSITORY, useClass: WishlistRepository },
    { provide: ICART_ITEM_REPOSITORY, useClass: CartItemRepository },
    WishlistMapper,
    CartItemMapper,
  ],
  exports: [IWISHLIST_REPOSITORY, ICART_ITEM_REPOSITORY],
})
export class StudentFeaturesModule {}
