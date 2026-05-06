import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartDocument, CartSchema } from '@/database/schemas/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartMapper } from './cart.mapper';
import { ICART_REPOSITORY } from '@/common/abstractions/repositories/i-cart.repository';
import { CourseModule } from '@/api/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CartDocument.name, schema: CartSchema }]),
    CourseModule,
  ],
  controllers: [CartController],
  providers: [
    CartService,
    CartMapper,
    {
      provide: ICART_REPOSITORY,
      useClass: CartRepository,
    },
  ],
  exports: [CartService, ICART_REPOSITORY],
})
export class CartModule {}
