import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDocument, OrderSchema } from '@/database/schemas/order.schema';
import { OrderItemDocument, OrderItemSchema } from '@/database/schemas/order-item.schema';
import { OrderRepository } from '@/api/order/order.repository';
import { OrderMapper } from '@/api/order/order.mapper';
import { OrderItemMapper } from '@/api/order/order-item.mapper';
import { TransactionDocument, TransactionSchema } from '@/database/schemas/transaction.schema';
import { TransactionMapper } from '@/api/order/transaction.mapper';
import { TransactionRepository } from '@/api/order/transaction.repository';
import { ITRANSACTION_REPOSITORY } from '@/common/abstractions/repositories/i-transaction.repository';
import { IOrderRepository } from '@/common/abstractions/repositories/i-order.repository';
import { OrderService } from '@/api/order/order.service';
import { OrderController } from '@/api/order/order.controller';
import { CartModule } from '@/api/cart/cart.module';
import { CourseModule } from '@/api/course/course.module';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
      { name: TransactionDocument.name, schema: TransactionSchema },
    ]),
    CartModule,
    CourseModule,
  ],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: ITRANSACTION_REPOSITORY, useClass: TransactionRepository },
    { provide: IOrderRepository, useClass: OrderRepository }, // Add this for consistency
    OrderService,
    OrderMapper,
    OrderItemMapper,
    TransactionMapper,
  ],
  exports: [ORDER_REPOSITORY, ITRANSACTION_REPOSITORY, OrderService],
})
export class OrderModule {}
