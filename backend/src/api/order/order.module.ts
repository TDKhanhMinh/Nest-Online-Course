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

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
      { name: TransactionDocument.name, schema: TransactionSchema },
    ]),
  ],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: ITRANSACTION_REPOSITORY, useClass: TransactionRepository },
    OrderMapper,
    OrderItemMapper,
    TransactionMapper,
  ],
  exports: [ORDER_REPOSITORY, ITRANSACTION_REPOSITORY],
})
export class OrderModule {}
